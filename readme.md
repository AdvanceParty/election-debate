# It's RoboScoMo vs Cybershorten

We’re building a pair of text-generating neural networks.

One will be trained on transcripts of speeches and interviews delivered by Scott Morrison, the other on Bill Shorten’s interviews and speeches. And then we’re to and hold the fourth leader’s debate of the election.

The models will be prompted with real questions from previous debates, with each answer being fed back into the opposing model for a chance to rebut.

We’re also going to use the models to generate an electoral victory speech for each candidate. We’ll publish the debate and predicted victory speeches on Wednesday before the election weekend, and then return post-election to compare the real winner’s speech with our model’s effort.

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

The results will be hosted on a website with the debate content displayed on the landing page, and secondary pages which give further information about how the application works, an interactive tool to explore more of the generated content, and the predicted victory speeches.

### Credit where credit is due

The neural network was built with [Max Woolf's](https://minimaxir.com/) excellent [textgenrnn](https://github.com/minimaxir/textgenrnn) library.

[Jannelle Shane's](https://aiweirdness.com/) experiments with neural networks are an ongoing course of inspiration and hilarity.
