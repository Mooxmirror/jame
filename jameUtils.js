var JameUtils = JameUtils || {};
JameUtils.Queue = function() {
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
JameUtils.Stack = function() {
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
JameUtils.version = "# jameJS v0.1.1";

try {
    exports.JameUtils = JameUtils;
}
catch (err) {
    console.error("NodeJS module system not detected");
}
