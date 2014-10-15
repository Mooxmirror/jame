var readline = require("readline");
var fs = require("fs");

console.log("jameJS - JavaScript machine emulator");

/*

Info:
HEX = hexadecimal number
x and y = data adresses

Connected devices:
0x0000 - ascii console driver

Commands:

ADD     x  y -> x + y = x
SUB     x  y -> x - y = x
MUL     x  y -> x * y = x
DIV     x  y -> x / y = x
MOD     x  y -> x % y = x

CPY     x  y -> x = VALUE OF y
MOV     x  HEX -> x = HEX
OUT     x  DEV -> SENDS x TO DEVICE

*/

var run = function(err, contents) {
    var lines = contents.toString().split("\n");
    var register = new Array(256);
    var CHAR_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ?!,;.:-_=#'+*()[]<>/\\\n";

    function sendToDevice(device, addr) {
        var value = register[addr];
        //console.log("SendToDevice " + device + ": " + addr + " / " + value + " / " + CHAR_SET[value]);
        process.stdout.write(CHAR_SET.charAt(value));
    }

    function exec(line) {
        if (line === "") {
            return;
        }

        var parts = line.split(" ");

        var cmd = parts[0];
        if (cmd === "ADD") {
            var addr1 = parseInt(parts[1], 16);
            var addr2 = parseInt(parts[2], 16);
            var resultValue = register[addr1] + register[addr2];
            register[addr1] = resultValue;
        } else if (cmd === "SUB") {
            var addr1 = parseInt(parts[1], 16);
            var addr2 = parseInt(parts[2], 16);
            var resultValue = register[addr1] - register[addr2];
            register[addr1] = resultValue;
        } else if (cmd === "MUL") {
            var addr1 = parseInt(parts[1], 16);
            var addr2 = parseInt(parts[2], 16);
            var resultValue = register[addr1] * register[addr2];
            register[addr1] = resultValue;
        } else if (cmd === "DIV") {
            var addr1 = parseInt(parts[1], 16);
            var addr2 = parseInt(parts[2], 16);
            var resultValue = register[addr1] / register[addr2];
            register[addr1] = resultValue;
        } else if (cmd === "MOD") {
            var addr1 = parseInt(parts[1], 16);
            var addr2 = parseInt(parts[2], 16);
            var resultValue = register[addr1] % register[addr2];
            register[addr1] = resultValue;
        } else if (cmd === "MOV") {
            var value = parseInt(parts[1], 16);
            var addr = parseInt(parts[2], 16);
            register[addr] = value;
        } else if (cmd == "OUT") {
            var device = parseInt(parts[2], 16);
            var addr = parseInt(parts[1], 16);
            sendToDevice(device, addr);
        }
    }
    for (var i = 0; i < lines.length; i += 1) {
        exec(lines[i]);
    }
}

fs.readFile("test.jame", run);
