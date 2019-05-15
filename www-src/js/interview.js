const { shuffle } = require('./util');
const questionElId = 'question';
const ENDPOINTS = {
  GET_REPLIES: '/.netlify/functions/getReplies',
};

const sampleQuestions = [
  `There are a lot of concerns as we know, health being one of them. `,
  `In a nutshell; aged care. We’re an ageing population. Are there plans in place for that or are we focusing on that?`,
  `What are you doing about the increased cost of living?`,
  `How do you feel about people buying time with government ministers, what message does that send?`,
  `Animal activists recently brought the Melbourne CBD to a standstill. What’s your message to them and what can you do?`,
  `Is the $1.6 billion underspend of the NDIS due to maladministration?`,
  `Unemployment is so low, but we're still not getting the pay rises? Is that going to change?`,
  `Do you think you can deliver budget surpluses?`,
  `Are you going to guarantee all these measures?`,
  `Is it wise to be spending extra money when there are headwinds facing our economy?`,
  `And what are the factors you’re considering?`,
  `Where is the wages growth going to come from?`,
  `Let's talk about your tax plans.`,
  `Why should voters trust you to do what you say you will do and what will you do to restore faith and trust in the political system?`,
  `Why should voters trust you and what will you do to restore trust and faith among voters in the political system?`,
  `Can you categorically rule out that there will be any negative impact on the economy or job losses as a result of a 45 per cent emissions reduction target?`,
  `How much of a threat is climate change to Australia's future?`,
  `How urgent is the need for action on climate change?`,
  `The Nissan Leaf is one of the more popular electric vehicles on the market, how much does that cost?`,
  `Shouldn’t you know how much that's going to cost?`,
  `Do high income earners really deserve about $140 billion worth of tax cuts at this time?`,
  `What will you do to increase wages?`,
  `Don't people have a right to know how much money you you're promising to put in their pocket?`,
  `Was the claim that the people smuggling trade would restart again after the passage of the Medevac bill simply a lie, given only one person came to Australia and we haven't seen an influx of boats?`,
  `Regarding franking, is there a limit based on the shareholder’s worth or value and how will this affect pensioners with small holdings?`,
  `What do you think of Clive Palmer and his campaign?`,
  `What do you admire about your opponent?`,
  `What do voters most need to know about your opponent?`,
  `What should voters know about you?`,
];

const ui = {
  interviewContainer: null,
  submitButton: null,
  textArea: null,
  suggestions: null,
};

const initInterview = interviewContainer => {
  ui.interviewContainer = interviewContainer;
  ui.suggestions = interviewContainer.querySelector('#suggestions');
  ui.textArea = interviewContainer.querySelectorAll('textArea')[0];
  ui.submitButton = interviewContainer.querySelectorAll('button')[0];
  ui.submitButton.onclick = e => {
    getReplies();
  };

  getSuggestions(3);
};

const getSuggestions = count => {
  shuffle(sampleQuestions);
  ui.suggestions.innerHTML = '';

  const el = document.createElement('ul');

  for (let i = 0; i < count; i++) {
    const item = document.createElement('li');
    const btn = document.createElement('button');
    item.appendChild(btn);
    el.appendChild(item);

    btn.innerText = sampleQuestions[i];
    btn.onclick = e => {
      updateQuestionBox(e.target.innerText);
    };
  }

  ui.suggestions.appendChild(el);
};

const updateQuestionBox = content => {
  ui.textArea.value = content;
};

const setMessage = (quote, speakerInfo) => {
  const el = createSection(speakerInfo.class, quote, speakerInfo.displayName);
  insertSection(el);
  return el;
  console.log(`${speakerInfo.displayName} (class - ${speakerInfo.class}) says: ${quote}`);
};

const callAPI = endpoint => {
  return new Promise(async function(resolve, reject) {
    setLoading(true);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      resolve(data);
    } catch (e) {
      reject(Error('*****WARNING******\n > Netlify lamba funcs are not available!'));
    } finally {
      setLoading(false);
    }
  });
};

const setLoading = isLoading => {
  // const wrapper = document.querySelector('#pitch');
  // isLoading ? wrapper.classList.add('loading') : wrapper.classList.remove('loading');
  isLoading
    ? ui.interviewContainer.classList.add('loading')
    : ui.interviewContainer.classList.remove('loading');
  console.log(`Is loading: ${isLoading}`);
};

const createSection = (className, content, title = null) => {
  const el = document.createElement('section');
  const body = document.createElement('p');

  body.innerText = content;
  el.classList.add(className);

  if (title) {
    const titleEl = document.createElement('h3');
    titleEl.innerText = title;
    el.appendChild(titleEl);
  }

  el.appendChild(body);

  return el;
};

const getQuestionText = () => {
  return ui.textArea.value;
};

const clearQuestionText = () => {
  ui.textArea.value = '';
};

const insertSection = el => {
  ui.interviewContainer.insertBefore(el, ui.submitButton.parentNode);
};

const getReplies = async () => {
  try {
    const replies = await callAPI(ENDPOINTS.GET_REPLIES);

    const questionEl = createSection('question', getQuestionText(), '');
    insertSection(questionEl);
    clearQuestionText();
    getSuggestions(3);
    replies.map(reply => {
      const el = setMessage(reply.quote, reply.speaker);
      el.scrollIntoView({
        behavior: 'smooth',
      });
    });
  } catch (e) {
    console.log(e.message);
  }
};

module.exports.initInterview = initInterview;
module.exports.getReplies = getReplies;
