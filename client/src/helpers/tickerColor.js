module.exports = (percentage) => {
  let num = Number(percentage)
  if (num < 0) {
    return '#E45E5E'
  } else {
    return '#56BC4E'
  }
}
