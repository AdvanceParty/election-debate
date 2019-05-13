const fs = require('fs');
const natural = require('natural');
const tokenizer = new natural.SentenceTokenizer();

const dataFiles = {
  questions: '../rnn/questions.txt',
  bs: '../rnn/generated/shorten.txt',
  sm: '../rnn/generated/pm.txt',
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

const wrapInTag = (content, tagName, className) => {
  const classAttr = className ? `class='${className}'` : '';
  return `<${tagName} ${classAttr}>${content}</${tagName}>`;
};

const makeDebate = dataFiles => {
  const data = loadData(dataFiles);
  const debate = [];

  const speakers = {
    host: { name: 'HOST', className: 'question', content: data.questions },
    bs: { name: 'SHORTEN', className: 'shorten', content: data.bs },
    sm: { name: 'PRIME MINISTER', className: 'pm', content: data.sm },
  };

  speakers.host.content.map((q, index) => {
    const firstSpeaker = Math.random() > 0.5 ? speakers.bs : speakers.sm;
    const secondSpeaker = firstSpeaker === speakers.sm ? speakers.bs : speakers.sm;
    const hasReply = Math.random() > 0.25;
    const hasRetort = hasReply && Math.random() > 0.75;

    debate.push(wrapInTag(`<h2>${speakers.host.name}</h2><p>${q}</p>`, 'section', speakers.host.className));
    debate.push(
      wrapInTag(
        `<h2>${firstSpeaker.name}</h2><p>${firstSpeaker.content.pop()}</p>`,
        'section',
        firstSpeaker.className,
      ),
    );

    if (hasReply) {
      debate.push(
        wrapInTag(
          `<h2>${secondSpeaker.name}</h2><p>${secondSpeaker.content.pop()}</p>`,
          'section',
          secondSpeaker.className,
        ),
      );
    }
    if (hasRetort) {
      debate.push(
        wrapInTag(
          `<h2>${firstSpeaker.name}</h2><p>${firstSpeaker.content.pop()}</p>`,
          'section',
          firstSpeaker.className,
        ),
      );
    }
  });

  return debate;
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

const debateArr = makeDebate(dataFiles);
console.log(debateArr.join('\n'));
