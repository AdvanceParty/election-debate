const fs = require('fs');
const natural = require('natural');
const tokenizer = new natural.SentenceTokenizer();

const files = [
  {
    inFile: '../trainingData/raw/bs_speech_and_interview.txt',
    outFile: './bs_speech_and_interview_tokenized.txt',
  },
  {
    inFile: '../trainingData/raw/sm_speech_and_interview.txt',
    outFile: './sm_speech_and_interview_tokenized.txt',
  },
  {
    inFile: '../rnn/generated/pm.txt',
    outFile: './bs_generated_tokenized.txt',
  },
  {
    inFile: '../rnn/generated/shorten.txt',
    outFile: './sm_generated_tokenized.txt',
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
