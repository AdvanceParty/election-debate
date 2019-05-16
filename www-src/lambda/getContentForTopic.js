const PATHS = {
  TOPIC_MODELS: '.',
  CONTENT: '.',
  UTILS: '.',
};

const loki = require('lokijs');
const db = new loki('loki.json');
const topics = db.addCollection('topics');

const { randomIntFromRange, shuffle } = require(`${PATHS.UTILS}/utils`);

const SPEAKERS = {
  SHORTEN: 'bs',
  MORRISON: 'sm',
};

const CONTENT = {
  [SPEAKERS.MORRISON]: require(`${PATHS.CONTENT}/pm.json`).quotes,
  [SPEAKERS.SHORTEN]: require(`${PATHS.CONTENT}/shorten.json`).quotes,
};

const keywords = require(`${PATHS.TOPIC_MODELS}/keywordData.json`);

keywords.bs.map(item => {
  const obj = { term: item.term, lines: [...item.lines], speaker: SPEAKERS.SHORTEN };
  topics.insert(obj);
});

keywords.sm.map(item => {
  const obj = { term: item.term, lines: [...item.lines], speaker: SPEAKERS.MORRISON };
  topics.insert(obj);
});

const getTopicInfo = term => {
  const bs = topics.find({ term, speaker: SPEAKERS.SHORTEN });
  const sm = topics.find({ term, speaker: SPEAKERS.MORRISON });

  return {
    bs: shuffle(bs.lines),
    sm: shuffle(sm.lines),
  };
};

const getContentForTopic = (topic, count = 3) => {
  const bs = topics.findOne({ term: topic, speaker: SPEAKERS.SHORTEN }) || { lines: [] };
  const sm = topics.findOne({ term: topic, speaker: SPEAKERS.MORRISON }) || { lines: [] };

  const bsLines = shuffle(bs.lines);
  const smLines = shuffle(sm.lines);

  // pad the array if the were no (nor not enough) direct keyword matches
  while (bsLines.length < count) {
    bsLines.push(randomIntFromRange(0, CONTENT.bs.length - 1));
  }
  while (smLines.length < count) {
    smLines.push(randomIntFromRange(0, CONTENT.sm.length - 1));
  }

  const result = {
    bs: new Array(),
    sm: new Array(),
  };

  for (var i = 0; i < count; i++) {
    const bsLine = bsLines[i];
    const smLine = smLines[i];
    result.bs.push(CONTENT.bs[bsLine]);
    result.sm.push(CONTENT.sm[smLine]);
  }

  return result;
};

module.exports.getContentForTopic = getContentForTopic;
