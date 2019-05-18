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

exports.handler = async (event, context) => {
  const payload = [];
  const body = JSON.parse(event.body);

  const question = body.question;
  const keywords = extractKeywords(question);
  const startWith = randomIntFromRange(0, Speakers.length - 1);
  const rand = Math.random();
  const replyCount = rand < 0.15 ? 3 : rand < 0.8 ? 2 : 1;
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
