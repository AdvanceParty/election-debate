var fs = require('fs');

const Speakers = [
  { id: 'pm', displayName: 'Prime Minister', quotesPath: './pm.json', class: 'pm' },
  { id: 'shorten', displayName: 'Shorten', quotesPath: './shorten.json', class: 'shorten' },
];

// only import quote files for speakers as needed
// because the quotes data files are big
const quotes = {};

const loadFile = fName => {
  return new Promise(function(resolve, reject) {
    fs.readFile(fName, 'utf-8', (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};

const getQuote = async speaker => {
  return new Promise(async function(resolve, reject) {
    if (!quotes[speaker.id]) {
      try {
        const data = await loadFile(speaker.quotesPath);
        const arr = JSON.parse(data).quotes;
        quotes[speaker.id] = arr;
        shuffle(quotes[speaker.id]);
      } catch (e) {
        reject(e);
      }
    }
    const quote = quotes[speaker.id].pop();
    resolve(quote);
  });
};

exports.handler = async event => {
  const replyCount = randomIntFromRange(1, 3);
  const startWith = randomIntFromRange(0, Speakers.length - 1);
  const payload = [];

  for (let i = 0; i < replyCount; i++) {
    const speaker = arrayItemFromAnyInt(startWith + i, Speakers);
    const quote = await getQuote(speaker);
    payload.push({ speaker, quote });
  }

  return {
    statusCode: 200,
    body: JSON.stringify(payload),
  };
};

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
test();
