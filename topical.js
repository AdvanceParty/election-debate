const PATHS = {
  TOPIC_MODELS: './aws_analysis/formatter',
  CONTENT: './www-src/lambda',
  UTILS: './www-src/lambda',
};

const loki = require('lokijs');
const db = new loki('loki.json');
const topics = db.addCollection('topics');
const docTopics = db.addCollection('docTopics');

const { randomIntFromRange, shuffle } = require(`${PATHS.UTILS}/utils`);

const SPEAKERS = {
  SHORTEN: 'bs',
  MORRISON: 'sm',
};

const CONTENT = {
  [SPEAKERS.MORRISON]: require(`${PATHS.CONTENT}/pm.json`).quotes,
  [SPEAKERS.SHORTEN]: require(`${PATHS.CONTENT}/shorten.json`).quotes,
};

// --------=------------------------------------
// ------ load data and insert in loki db ------
require(`${PATHS.TOPIC_MODELS}/shorten-topic-terms`).map(item => {
  topics.insert({ ...item, speaker: SPEAKERS.SHORTEN });
});

require(`${PATHS.TOPIC_MODELS}/morrison-topic-terms`).map(item => {
  topics.insert({ ...item, speaker: SPEAKERS.MORRISON });
});

require(`${PATHS.TOPIC_MODELS}/shorten-doc-topics`).map(item => {
  docTopics.insert({ ...item, speaker: SPEAKERS.SHORTEN });
});

require(`${PATHS.TOPIC_MODELS}/morrison-doc-topics`).map(item => {
  docTopics.insert({ ...item, speaker: SPEAKERS.MORRISON });
});

const getTopicInfo = term => {
  const bs = topics.find({ term, speaker: SPEAKERS.SHORTEN });
  const sm = topics.find({ term, speaker: SPEAKERS.MORRISON });
  console.log(bs);
  console.log(sm);
  return {
    [SPEAKERS.SHORTEN]: topics.find({ term, speaker: SPEAKERS.SHORTEN }),
    [SPEAKERS.MORRISON]: topics.find({ term, speaker: SPEAKERS.MORRISON }),
  };
};

/**
 * Get a list of line numbers for a given speaker which
 * match topic id in a collection of [n] topics.
 * Returns a single, flattened array of all relevant line numbers
 * @param {*} topicsCollection
 */
const getLineNumsForTopics = topicsCollection => {
  const flattenedLineNums = topicsCollection.reduce((acc, topic) => {
    const { id, speaker, weight } = topic;
    const resultSet = docTopics.find({ id, speaker });
    return [...acc, ...resultSet.map(result => result.line)];
  }, []);
  return shuffle(flattenedLineNums);
};

const getContentForTopic = (topic, count = 3) => {
  const topicData = getTopicInfo(topic);
  const bsLines = getLineNumsForTopics(topicData[SPEAKERS.SHORTEN]);
  const smLines = getLineNumsForTopics(topicData[SPEAKERS.MORRISON]);
  const result = {
    [SPEAKERS.SHORTEN]: new Array(),
    [SPEAKERS.MORRISON]: new Array(),
  };
  for (var i = 0; i < count; i++) {
    result[SPEAKERS.SHORTEN].push(CONTENT[SPEAKERS.SHORTEN][bsLines[i]]);
    result[SPEAKERS.MORRISON].push(CONTENT[SPEAKERS.MORRISON][smLines[i]]);
  }

  return result;
};

// const lineNums = getContentForTopic('tax');
// console.log(lineNums.bs);
const quotes = getContentForTopic('climate');
// const bsOptions = topicData[SPEAKERS.SHORTEN];
// const smOptions = topicData[SPEAKERS.MORRISON];

// const n1 = randomIntFromRange(0, bsOptions.length);
// const n2 = randomIntFromRange(0, smOptions.length);
// const bsLineNum = bsOptions[n1];
// const smLineNum = smOptions[n2];

// console.log(CONTENT[SPEAKERS.SHORTEN][bsLineNum]);
// console.log(CONTENT[SPEAKERS.MORRISON][smLineNum]);
console.log(quotes);
