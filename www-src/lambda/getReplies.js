// var fs = require('fs');

// const pmContent = require('./pm.json');
// const shortenContent = require('./shorten.json');
const { randomIntFromRange, shuffle, arrayItemFromAnyInt } = require('./utils');
const getContentForTopic = require('./getContentForTopic');

// const Speakers = [
//   { id: 'pm', displayName: 'Prime Minister', quotesPath: './pm.json', class: 'pm' },
//   { id: 'shorten', displayName: 'Shorten', quotesPath: './shorten.json', class: 'shorten' },
// ];

// topicId -- needed as short term fix because I used bs/sm initials to identify speakers
// in the topic extraction, but pm/shorten everywhere else.
// yes, i am an idiot.
const Speakers = [
  { id: 'pm', displayName: 'Prime Minister', class: 'pm', topicId: 'sm' },
  { id: 'shorten', displayName: 'Shorten', class: 'shorten', topicId: 'bs' },
];

// const quotes = {
//   pm: pmContent.quotes,
//   shorten: shortenContent.quotes,
// };

// const loadFile = fName => {
//   return new Promise(function(resolve, reject) {
//     fs.readFile(fName, 'utf8', (err, data) => {
//       err ? reject(err) : resolve(data);
//     });
//   });
// };

// const getQuote = async speaker => {
//   return new Promise(async function(resolve, reject) {
//     const quote = quotes[speaker.id].pop();
//     resolve(quote);
//   });
// };

exports.handler = async event => {
  const replyCount = randomIntFromRange(1, 3);
  const startWith = randomIntFromRange(0, Speakers.length - 1);
  const payload = [];

  const quotes = getContentForTopic('tax', replyCount);

  for (let i = 0; i < replyCount; i++) {
    const speaker = arrayItemFromAnyInt(startWith + i, Speakers);
    const quote = quotes[speaker.id][i];
    payload.push({ speaker, quote });
  }

  return {
    statusCode: 200,
    body: JSON.stringify(payload),
  };
};
