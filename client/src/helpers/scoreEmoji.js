module.exports = (score) => {
  if (isNaN(score)) {
    return "N/A"
  }
  if (score > 0.75) {
    return "😀"
  }
  if (score < 0.75 && score > 0.25) {
    return "🙂"
  }
  if (score > -0.25 && score < 0.25) {
    return "😐" 
  }
  if (score < -0.25 && score > -0.75) {
    return "😟"
  }
  if (score < -0.75) {
    return "😡"
  }
}

