const { shuffle } = require('./util');
const questionElId = 'question';
const ENDPOINTS = {
  GET_REPLIES: '/.netlify/functions/getReplies',
};

const sampleQuestions = [
  `There are a lot of concerns as we know, health being one of them. `,
  `Aged care: what are your plans for focusing on that?`,
  `What are you doing about the increased cost of living?`,
  `Is the $1.6 billion underspend of the NDIS due to maladministration?`,
  `Unemployment is so low, but when will wages start to rise?`,
  `Do you think you can deliver budget surpluses?`,
  `Are you going to guarantee all these measures?`,
  `Is it wise to be spending extra money when there are headwinds facing our economy?`,
  `And what are the factors you’re considering?`,
  `Where is the wages growth going to come from?`,
  `Let's talk about your tax plans.`,
  `Why should voters trust you to do what you say?`,
  `How will you restore faith and trust in the political system?`,
  `Will a 45 per cent emissions reduction target affect the economy?`,
  `How much of a threat is climate change to Australia's future?`,
  `How urgent is the need for action on climate change?`,
  `How much does an electric car cost?`,
  `Do high income earners really deserve $140 billion worth of tax cuts?`,
  `Is the franking policy a retirement tax?`,
  `What do you think of Clive Palmer and his campaign?`,
  `What do you admire about your opponent?`,
  `What do voters most need to know about your opponent?`,
  `What should voters know about you?`,
];

const ui = {
  interviewContainer: null,
  transcriptContainer: null,
  submitButton: null,
  textArea: null,
  suggestions: null,
};

const initInterview = interviewContainer => {
  ui.interviewContainer = interviewContainer;
  ui.transcriptContainer = interviewContainer.querySelector('#transcript');
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

const getQuestionText = () => {
  return ui.textArea.value;
};

const clearQuestionText = () => {
  ui.textArea.value = '';
};

const insertSection = el => {
  ui.interviewContainer.insertBefore(el, ui.submitButton.parentNode);
};
const insertReply = el => {
  ui.transcriptContainer.appendChild(el);
};

const getReplies = async () => {
  try {
    const replies = await callAPI(ENDPOINTS.GET_REPLIES);

    const questionEl = createSection('question', getQuestionText(), '');
    insertReply(questionEl);

    replies.map(reply => {
      const el = createSection(reply.speaker.class, quote);
      insertReply(el);

      el.scrollIntoView({
        behavior: 'smooth',
      });
    });

    // clean up the UI
    clearQuestionText();
    getSuggestions(3);
  } catch (e) {
    console.log(e.message);
  }
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

module.exports.initInterview = initInterview;
module.exports.getReplies = getReplies;
