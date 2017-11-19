module.exports = (score) => {
  let num = Number(score)
  if (num < -0.25) {
    return '#E45E5E'
  } else if (num > 0.25) {
    return '#56BC4E'
  } else {
    return '#828282'
  }
}
