const dQuery = query => document.querySelector(query);
const dQueryAll = query => document.querySelectorAll(query);

const randomIntFromRange = (min, max) => {
  if (min >= max) throw Error('First argument must be smaller than second argument');
  return min + Math.floor(Math.random() * max);
};

/**
 * Fetch an item from an array, using any integer to
 * specify the index of the required item. If num is larger
 * than array length, the function will loop back to the first item
 * in the array and keep counting
 * eg:
 * myArr = ["a","b","c"]
 * arrayItemFromAnyInt(0, myArr) //  "a"
 * arrayItemFromAnyInt(2, myArr) //  "c"
 * arrayItemFromAnyInt(4, myArr) //  "b"
 * arrayItemFromAnyInt(819, myArr) //  "a"
 *
 * @param num
 * @param arr
 */
const arrayItemFromAnyInt = (num, arr) => arr[num % arr.length];

/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
const shuffle = array => {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

module.exports.randomIntFromRange = randomIntFromRange;
module.exports.arrayItemFromAnyInt = arrayItemFromAnyInt;
module.exports.shuffle = shuffle;
module.exports.dQuery = dQuery;
module.exports.dQueryAll = dQueryAll;
