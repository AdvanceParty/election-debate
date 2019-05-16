const PATHS = {
  TOPIC_MODELS: './',
  CONTENT: './',
  UTILS: './',
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

module.exports = (topic, count = 3) => {
  const bs = topics.findOne({ term: topic, speaker: SPEAKERS.SHORTEN });
  const sm = topics.findOne({ term: topic, speaker: SPEAKERS.MORRISON });

  const bsLines = shuffle(bs.lines);
  const smLines = shuffle(sm.lines);

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
