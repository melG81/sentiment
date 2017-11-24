module.exports = (string) => {
  let encode = encodeURI(string)
  let encodeDasherized = encode.replace(/(%20|\/)/g,'-')
  return encodeDasherized
}
