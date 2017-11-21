/**
 * @function {simple iterator helper}
 * @param  {Number} n     {number to iterate up to starting from 1}
 * @param  block {block argument}
 */
module.exports = (n, block) => {
  let accum = '';
  for (let i = 1; i <= n; ++i)
    accum += block.fn(i);
  return accum;
}