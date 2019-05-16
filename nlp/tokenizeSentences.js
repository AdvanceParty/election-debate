const fs = require('fs');
const natural = require('natural');
const tokenizer = new natural.SentenceTokenizer();

const smQuotes = require('../www-src/lambda/pm.json').quotes;
const bsQuotes = require('../www-src/lambda/shorten.json').quotes;

const files = [
  {
    inFile: '../trainingData/raw/morrison/morrison_answers_only.txt',
    outFile: '../trainingData/tokenized/morrison_answers_tokenized.txt',
  },
  {
    inFile: '../trainingData/raw/shorten/shorten_answers_only.txt',
    outFile: '../trainingData/tokenized/shorten_answers_tokenized.txt',
  },
];

const nextFile = files => {
  if (files.length > 0) {
    const { inFile, outFile } = files.pop();

    fs.readFile(inFile, 'utf-8', function read(err, data) {
      if (err) throw err;

      const tokenized = tokenizer.tokenize(data).join('\n');
      saveTokenized(tokenized, outFile, files);
    });
  } else {
    // done
  }
};

const saveTokenized = (data, fName, files) => {
  fs.writeFile(fName, data, err => {
    if (err) throw err;
    console.log(`Saved ${fName}`);
    nextFile(files);
  });
};

nextFile(files);
