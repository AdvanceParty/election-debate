const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const inputPath = './raw/raw.json';
const outputPath = './corpus.txt';

const start = async (inputPath, outputPath) => {
  const raw = await readFile(inputPath);
  const data = JSON.parse(raw);
  const { pm, shorten, atmos, questions } = sortData(data);
  const outputString = serialiseAll(pm, shorten, atmos, questions);
  const result = await writeFile(outputPath, outputString);

  console.log(outputString.substring(0, 500));
  console.log('DONE!');
};

const sortData = data => {
  const { items } = data;
  const sorted = {};
  items.map(item => {
    sorted[item.speaker] = sorted[item.speaker] || new Array();
    sorted[item.speaker].push(item);
  });

  return {
    pm: shuffle(sorted['PRIME MINISTER']),
    shorten: shuffle(sorted['SHORTEN']),
    questions: shuffle(sorted['INTERVIEWER']),
    atmos: shuffle(sorted['ATMOS']),
  };
};

const serialiseSpeechItem = obj => {
  const s = obj.speaker === 'ATMOS' ? '' : `${obj.speaker}: `;
  const sentences = obj.value.split('.');
  let value = sentences[0];
  if (value.length < 50 && sentences.length > 1) {
    value += `. ${sentences[1]}`;
  }
  return s + value + '\n';
};

const getArrayItem = (arr, i) => arr[i % arr.length];

const serialiseAll = (pm, shorten, atmos, questions) => {
  let output = '';
  const itemCount = Math.max(pm.length, shorten.length, questions.length, atmos.length);

  console.log(`Sorting ${itemCount} items.`);

  for (var i = 0; i < itemCount; i++) {
    const reply_pm = serialiseSpeechItem(getArrayItem(pm, i));
    const reply_shorten = serialiseSpeechItem(getArrayItem(shorten, i));
    const question = serialiseSpeechItem(getArrayItem(questions, i));
    const audience = serialiseSpeechItem(getArrayItem(atmos, i));

    output += question;
    output += Math.random() >= 0.5 ? reply_shorten + reply_pm : reply_pm + reply_shorten;
    output += Math.random() >= 0.9 ? audience : '';
  }

  return output;
};

/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
var shuffle = function(array) {
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

start(inputPath, outputPath);
