const fs = require('fs');
const natural = require('natural');
const tokenizer = new natural.SentenceTokenizer();

const dataFiles = {
  questions: '../rnn/questions.txt',
  bs: './bs_generated_tokenized.txt',
  sm: './sm_generated_tokenized.txt',
};

const loadData = dataFiles => {
  let questions = fs.readFileSync(dataFiles.questions, 'utf-8').split('\n');
  let count = questions.length;

  let bs = shuffle(fs.readFileSync(dataFiles.bs, 'utf-8').split('\n')).slice(count * 2);
  let sm = shuffle(fs.readFileSync(dataFiles.sm, 'utf-8').split('\n')).slice(count * 2);

  return { questions, bs, sm };
};

const saveData = (data, fName, files) => {
  fs.writeFile(fName, data, err => {
    if (err) throw err;
    console.log(`Saved ${fName}`);
    nextFile(files);
  });
};

const makeDebate = dataFiles => {
  const { questions, bs, sm } = loadData(dataFiles);
  const speakers = {
    bs: { name: 'SHORTEN', class="shorten", content: bs },
    sm: { name: 'PRIME MINISTER', class="pm", content: sm },
  };

  let debate_str = '';

  questions.map((q, index) => {
    const firstSpeaker = Math.random() > 0.5 ? speakers.bs : speakers.sm;
    const secondSpeaker = firstSpeaker === speakers.sm ? speakers.bs : speakers.sm;
    const hasReply = Math.random() > 0.25;
    const hasRetort = hasReply && Math.random() > 0.75;

    debate_str += `<section class='question'>HOST: ${q}\n`;
    debate_str += `${firstSpeaker.name}: ${firstSpeaker.content.pop()}\n`;

    if (hasReply) {
      debate_str += `${secondSpeaker.name}: ${secondSpeaker.content.pop()}\n`;
    }
    if (hasRetort) {
      debate_str += `${firstSpeaker.name}: ${firstSpeaker.content.pop()}\n`;
    }

    debate_str += '\n';
  });

  return debate_str;
};

// -----------------------------------------------

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

const debate = makeDebate(dataFiles);
console.log(debate);
