// Function to convert BigInt to tuple
function bigint_to_tuple(x) {
  let mod = 2n ** 64n;
  let ret = [0n, 0n, 0n, 0n];

  var x_temp = x;
  for (var idx = 0; idx < ret.length; idx++) {
    ret[idx] = x_temp % mod;
    x_temp = x_temp / mod;
  }
  return ret;
}

// Function to convert hex to decimal
function h2d(hex) {
  if (hex.length % 2) {
    hex = '0' + hex;
  }
  const bn = BigInt('0x' + hex);
  return bn.toString(10);
}

// Function to convert decimal to hex
function d2h(dec) {
  return BigInt(dec).toString(16);
}

// Function to fill array with a value
function fillArray(arr, max, value) {
  const length = arr.length;
  for (let i = length; i < max; i++) {
    arr[i] = value;
  }
  return arr;
}

module.exports = {
  bigint_to_tuple,
  h2d,
  d2h,
  fillArray,
};
