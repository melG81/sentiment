let decode = module.exports = {}

decode.dashes = (string) => {
  let dashedString = string.replace(/-/g, ' ');
  return dashedString
}
