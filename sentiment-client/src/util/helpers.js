let helpers = module.exports = {}

helpers.truncate = function (string, num) {
  let sliced = string.slice(0, num)
  return `${sliced}...`;
}