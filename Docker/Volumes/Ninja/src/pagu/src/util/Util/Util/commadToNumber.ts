module.exports = function (number: String) {
  return parseInt(number.toString().split(",").join(""));
};
