"use strict";
module.exports = function (number) {
    return parseInt(number.toString().split(",").join(""));
};
