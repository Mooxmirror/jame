console.log("jameJS v0.1.0");


/*
a - z -> data addresses
* means implemented

Commands:

ADD *     x     +     y // Add, stores result in x
SUB *    x     -     y // Subtration, stores result in x
MUL *    x     *     y // Multiplication, stores result in x
DIV *    x     /     y // Division, stores result in x
MOD *    x     %     y // Modulo, stores result in x

CMP *    x           y // Compares the values, stores result in x (0 -> x smaller, 1 -> equal, 2 -> x greater)
MRK *    x             // Marks the line with a adress stored in x
JMP     x             // Jumps to the line adress stored in x
JIF     x           y // Jumps to the line adress stored in x, when y equals 1

LDM *    x           y // Loads data from volatile memory into register
STM *    x           y // Stores data from register in volatile memory

CPY *    x           y // Copies the value from x to y
MOV *    HexNumber   x // Moves the value into register x
OUT *    DeviceID    x // Sends data from the register to the device
IN      DeviceID    x // Receives data from the device stack (-1 -> no data available)
*/

var Jame = function(programLines, debugMode) {
    "use strict";
    var activePointer = 0,
        programRegister = new Array(),
        jumpMarkRegister = new Array(),
        deviceRegister = new Array(16),
        dataRegister = new Array(256),
        dataMemory = new Array(1024),
        charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ?!,;.:-_=#'+*()[]<>/\\\n";
    // Init devices and data registers
    (function() {
        var i = 0;

        for (i = 0; i < dataRegister.length; i += 1) {
            dataRegister[i] = 0;
        }
        for (i = 0; i < dataMemory.length; i += 1) {
            dataMemory[i] = 0;
        }
        for (i = 0; i < deviceRegister.length; i += 1) {
            // Fill devices with template function
            deviceRegister[i] = {
                in: function(dataValue, dataAddr, dataRegister) {
                    console.log(dataValue, dataAddr, dataRegister);
                },
                out: function() {
                    return -1;
                }
            };
        }
        var programRegisterLines = programLines.split("\n");
        for (i = 0; i < programRegisterLines.length; i++) {
            programRegister.push(programRegisterLines[i]);
        }

        if (debugMode) {
            console.log("Initialized data register, memory and devices");
        }
    })();
    /*
    Util functionality
    */
    var Queue = function() {
        var queueData = new Array();
        this.pop = function() {
            return queueData.unshift();
        }
        this.push = function(value) {
            return queueData.push(item);
        }
        this.peek = function() {
            return queueData[0];
        }
        this.isEmpty = function() {
            if (queueData.length == 0)
                return true;
            return false;
        }
    }
    var Stack = function() {
        var stackData = new Array();
        this.pop = function() {
            return stackData.pop();
        }
        this.push = function(value) {
            return stackData.push(item);
        }
        this.peek = function() {
            return stackData[stackData.length - 1];
        }
        this.isEmpty = function() {
            if (stackData.length == 0)
                return true;
            return false;
        }
    }
    /*
    Returns the hex string.
    */
    var getHex = function(intNumber) {
        return intNumber.toString(16);
    }
    /*
    Returns the int value.
    */
    var getInt = function(hexNumber) {
        return parseInt(hexNumber, 16);
    }
    /*
    Sets the device callback.
    deviceCallback(dataValue, dataAddr, dataRegister)
    */
    var setDevice = function(deviceAddr, device) {
        if (debugMode) {
            console.log("Updated device for address", toHex(deviceAddr));
        }
        setDevice(deviceAddr, device);
    }
    /*
    Returns the device callback.
    */
    var getDevice = function(deviceAddr) {
        if (debugMode) {
            console.log("Device data returned for", getHex(deviceAddr));
        }
        return deviceRegister[deviceAddr];
    }
    var setMemoryData = function(dataAddr, dataValue) {
        if (debugMode) {
            console.log("Memory data", getHex(dataAddr), "set to", getHex(dataValue));
        }
        dataMemory[dataAddr] = dataValue;
    }
    var getMemoryData = function(dataAddr) {
        if (debugMode) {
            console.log("Memory data", getHex(dataAddr), "returned");
        }
        return dataMemory[dataAddr];
    }
    var storeMark = function(dataAddr) {
        var dataValue = jumpMarkRegister.push(activePointer) - 1;
        setData(dataAddr, dataValue);
        if (debugMode) {
            console.log("Jump mark for line", getHex(dataValue), "stored in", getHex(dataAddr));
        }
    }
    var getMark = function(dataAddr) {
        var dataValue = getData(dataAddr);
        if (debugMode) {
            console.log("Mark for line", getHex(dataValue), "at", getHex(dataAddr), "returned");
        }
        return jumpMarkRegister[dataValue];
    }
    /*
    Returns the data at the address.
    */
    var getData = function(dataAddr) {
        if (debugMode) {
            console.log("Data register", getHex(dataAddr), "returned");
        }
        return dataRegister[dataAddr];
    }
    /*
    Sets the data at the specific address.
    */
    var setData = function(dataAddr, dataValue) {
        if (debugMode) {
            console.log("Data register", getHex(dataAddr), "set to", getHex(dataValue));
        }
        dataRegister[dataAddr] = dataValue;
    }

    /*
    Sends a set of data to the device
    */
    var sendToDevice = function(deviceAddr, dataAddr) {
        var dataValue = getData(dataAddr);
        var device = getDevice(deviceAddr);

        if (debugMode) {
            console.log("Device called", getHex(deviceAddr));
        }

        device.in(dataValue, dataAddr, dataRegister);
    }
    /*
    Gets a bit of data from the device
    */
    var receiveFromDevice = function(deviceAddr, dataAddr) {
        var device = getDevice(deviceAddr);
        var dataValue = device.out();

        if (debugMode) {
            console.log("Device data received", getHex(deviceAddr), "value", getHex(dataValue));
        }
        setData(dataAddr, dataValue);
    }
    /*
    Returns the active char set.
    */
    var getCharSet = function() {
        return charSet;
    }
    /*
    Executes a line of code.
    */
    var execute = function() {
        var activeLine = programRegister[activePointer],
            lineParts = activeLine.split(" "),
            command = lineParts[0],
            args = new Array();


        if (activeLine === "" || activeLine.charAt(0) === "/") {
            return;
        }
        for (var i = 1; i < lineParts.length; i += 1) {
            args.push(lineParts[i]);
        }
        if (debugMode) {
            console.log("Command", command);
            console.log("Args", args);
        }
        if (command === "ADD" || command === "SUB" || command === "MUL" || command === "DIV" || command === "MOD") {
            var addrX = getInt(args[0]);
            var addrY = getInt(args[1]);

            var valueX = getData(addrX);
            var valueY = getData(addrY);

            var resultValue = 0;
            switch (command) {
                case "ADD":
                    resultValue = valueX + valueY;
                    break;
                case "SUB":
                    resultValue = valueX - valueY;
                    break;
                case "MUL":
                    resultValue = valueX * valueY;
                    break;
                case "DIV":
                    resultValue = valueX / valueY;
                    break;
                case "MOD":
                    resultValue = valueX % valueY;
                    break;
            }
            setData(addrX, resultValue);
        } else if (command === "MOV") {
            var valueX = getInt(args[0]);
            var addrX = getInt(args[1]);

            setData(addrX, valueX);
        } else if (command === "OUT") {
            var deviceAddr = getInt(args[0]);
            var dataAddr = getInt(args[1]);

            sendToDevice(deviceAddr, dataAddr);
        } else if (command === "CPY") {
            var addrX = getInt(args[0]);
            var addrY = getInt(args[1]);

            setData(addrY, getData(addrX));
        } else if (command === "CMP") {
            var addrX = getInt(args[0]);
            var addrY = getInt(args[1]);

            var valueX = getData(addrX);
            var valueY = getData(addrY);

            var resultValue = -1;
            if (valueX < valueY) {
                resultValue = 0;
            } else if (valueX === valueY) {
                resultValue = 1;
            } else if (valueX > valueY) {
                resultValue = 2;
            }
            setData(addrX, resultValue);
        } else if (command === "STM") {
            var addrX = getInt(args[0]);
            var addrY = getInt(args[1]);

            var valueX = getData(addrX);
            setMemoryData(addrY, valueX);
        } else if (command === "LDM") {
            var addrX = getInt(args[0]);
            var addrY = getInt(args[1]);

            setData(addrY, getMemoryData(addrX));
        } else if (command === "MRK") {
            var addrX = getInt(args[0]);
            storeMark(addrX);
        } else if (command === "JMP") {
            var addrX = getInt(args[0]);
            var valueX = getData(addrX);
            var markAddr = getMark(valueX);

            activePointer = markAddr;
        }
    }
    var start = function() {
        for (activePointer = 0; activePointer < programRegister.length; activePointer++) {
            if (debugMode) {
                console.log("Running line", activePointer);
            }
            execute();
        }
    }

    return {
        start: start,
        getCharSet: getCharSet,
        getDevice: getDevice,
        setDevice: setDevice,
        register: dataRegister,
        memory: dataMemory
    }
}

try {
    exports.Jame = Jame;
}
catch (err) {
    console.log("NodeJS module system not detected");
}
