# It's RoboScoMo vs Cybershorten

Not sure who to vote for in Australia's 2019 Federal Election? Advance Party is here to help!

We’ve built a pair of text-generating neural networks. One network has been trained on transcripts of speeches and interviews delivered by Scott Morrison, the other on Bill Shorten’s interviews and speeches. You can see where this is going, right?

This website makes the models available for anyone to interview. Ask them probing questions. Dig deep into their motivations and prinicples. Challenge them to convince you that they have the vision needed to steer the good ship 'Straya through the turbulent waters of our post-truth, social-media frenzied, climate apocalypse times.

The neural networks probably won't give a direct, or even relevant, answer to your qwuestions. To be honest, the content may well be entirely nonsensical. We think that makes them eminently qualified for a career in politics.

Visit [Game of Clones](https://vote1.advanceparty.com.au) to see it in action.

## Deployment

Continuous deployment to Netlify is configured via webhooks.
To trigger a new deployment, push to the master branch on the github repo.

## Requirements

#### To build the static site

- NPM or Yarn
- Node 10~ (later version may also be OK but are untested)

### Watchouts

The current app uses a pretty brutal method of extracting each reponse. The getReplies lambda function loads all responses from both speakers, plus the keywords map each time it is called -- a few MB of data. This is very inefficient and puts a hard cap on the amount of data that can be pre-generated for use. A proper solution would use a database or find an efficient way of generating content on demand.

#### To generate new content

- python 3.6 (3.7 will not work)
- tensorflow for python

Use `npm run generateDialog` to generate 100 new lines of content from each models.
Output is saved to`generated/pm.txt` and `generated/shorten.txt`. The script uses write-append mode, each new line is added to the text files without overwriting any existing data. If the \*.txt files don't exist, new ones will be created.

Under the hood, the npm `generateDialog` script is just a wrapper for the `tools/generateDialoig.py`. You can call this script directly and use command line arguments to customise the output.

- -p string -> seed each item with some starter text
- -n int -> number of items to generate
- -t float -> temperature for content generation. Higher numbers = more creative/random output. Values above 1 rapidly become gibberish.
- -o string -> path and name of file to save output. If not supplied, output is dumped to stdin.
- -m string --> path to models for content generation. Note this is a directory path only, with model name expected to follow the format textgenrnn\_\[config|vocab|weights\].\[json|hd5\]. eg: `-m /models/bob/` will look for `/models/bob/rextgenrnn_config.json`, `/models/bob/rextgenrnn_vocab.json`, and `/models/bob/rextgenrnn_weights.md5`.

#### Preparing generated .txt content files for use in website

There are a couple of steps required if you want to put your newly generated content into the site:

1. Each speaker's generated content needs to be converted into JSON
2. JSON files saved in `www-src/lambda/` as `pm.json` or `shorten.json`
3. Build a keyword map of terms and topics in the speaker's JSON files, and saved to `www-src/lambda/keywordData.json`

You need to do steps 1 & 2 manually, but this is pretty quick and easy with a search/replace in your text editor -- especially if you use regex terms. In VSCode, use `^(.*)$` as your search term, and `"$1",` as the replacement term and you're 95% of the way home. The JSON output needs to follow this format:

```
{
  "quotes": [
    "line of content",
    "line of content",
    ...
    "line of content",
  ]
}
```

Once you've gert your JSON files built and saved into the right place, step 3 is easy. Just run `npm run generateKeywords`. This launches a script which will parse over the shorten.json and pm.json files, extract keywords and topics, record the array indexes where each topic appears, and then save the whole lot to `www-src/lambda/keywordData.json`.

**WARNING: This will overwrite the current file at this location.**

The keyword map is used to help make the output on the website somewhat related to the questions users ask. When a user asks a question, the web app:

- Extracts keywords and topics from the submitted text
- Randomly chooses a keyword or topic from the extracted list\*
- Uses the keywordData.json file to find a list of options from each speaker which match the selected topic
- Returns one or more repsonses, randomly selected form the list of matches.

\* This would be a good place to improve the app. Ideally, the app should select the lookup keyword/topic based on relevance and confidence, not pure random chance.

## What, exactly, are they going to say?

We’re not expecting the models to generate any content which stands up to close scrutiny (this is an election debate, after all) but we will be analysing the generated against a range off criteria such as:

• sentiment
• vocabulary size and level
• favorite topics and keywords
• complexity
• repetition

We plan to use this data to create visual profiles each human and software speaker, and compare the differences and similarities.

## Datasources

The training data has been sourced mostly from the candidate’s own websites https://www.billshorten.com.au/transcripts and https://www.pm.gov.au/media.

We’ve scraped these media pages for interview and speech transcripts and built training datasets of 70,000 words for Shorten and 50,000 words for Morrison.

These are fairly small for modelling full language generation from scratch, but sufficient for style imitation when laid on top of a much larger model pre-trained on more generalised English language texts. At the moment, the base model is built from a combination of a politics subreddit, sections of Hansard records from 2018 and randomly selected media articles from Australian newspapers. The base models and training sets are still in the process of being refined but are already generating content with a distinctive tone for both candidates.

### Credit where credit is due

The neural network was built with [Max Woolf's](https://minimaxir.com/) excellent [textgenrnn](https://github.com/minimaxir/textgenrnn) library.

[Jannelle Shane's](https://aiweirdness.com/) experiments with neural networks are an ongoing course of inspiration and hilarity.
