module.exports = (string, num) => {
  let number = Number(string)
  let round = Number(num)
  return number.toFixed(round)
}
