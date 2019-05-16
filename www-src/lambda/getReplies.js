// var fs = require('fs');

// const pmContent = require('./pm.json');
// const shortenContent = require('./shorten.json');
var vfile = require('to-vfile');
var retext = require('retext');
var keywords = require('retext-keywords');
var toString = require('nlcst-to-string');

const { randomIntFromRange, shuffle, arrayItemFromAnyInt } = require('./utils');
const { getContentForTopic } = require('./getContentForTopic');

const extractKeywords = str => {
  const kw = [];

  retext()
    .use(keywords)
    .process(str, (err, file) => {
      if (err) throw err;
      const words = file.data.keywords.map(item => {
        kw.push(toString(item.matches[0].node).toLowerCase());
      });
    });
  return shuffle(kw);
};

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

exports.handler = async (event, context) => {
  const replyCount = randomIntFromRange(1, 3);
  const startWith = randomIntFromRange(0, Speakers.length - 1);
  const payload = [];

  const body = JSON.parse(event.body);
  const question = body.question;
  const keywords = extractKeywords(question);

  console.log(keywords);

  const quotes = getContentForTopic(keywords[0], replyCount);

  for (let i = 0; i < replyCount; i++) {
    const speaker = arrayItemFromAnyInt(startWith + i, Speakers);
    const quote = quotes[speaker.topicId][i];
    payload.push({ speaker, quote });
  }

  return {
    statusCode: 200,
    body: JSON.stringify(payload),
  };
};
