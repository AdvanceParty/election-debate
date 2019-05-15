var fs = require('fs');
const pmContent = require('./pm.json');
const shortenContent = require('./shorten.json');
const { randomIntFromRange, shuffle, arrayItemFromAnyInt } = require('./utils');

const Speakers = [
  { id: 'pm', displayName: 'Prime Minister', quotesPath: './pm.json', class: 'pm' },
  { id: 'shorten', displayName: 'Shorten', quotesPath: './shorten.json', class: 'shorten' },
];

const quotes = {
  pm: pmContent.quotes,
  shorten: shortenContent.quotes,
};

const loadFile = fName => {
  return new Promise(function(resolve, reject) {
    fs.readFile(fName, 'utf8', (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};

const getQuote = async speaker => {
  return new Promise(async function(resolve, reject) {
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
