const { shuffle } = require('./util');
const { ENDPOINTS } = require('./config');

const sampleQuestions = require('./sampleQuestions');
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

  ui.textArea.addEventListener('input', function(e) {
    validateInputText(e.target);
  });

  validateInputText(ui.textArea);
  getSuggestions(3);
};

const validateInputText = inputElement => {
  const btn = ui.submitButton;
  btn.disabled = inputElement.value.length < 5;
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
      getReplies();
    };
  }

  ui.suggestions.appendChild(el);
};

const updateQuestionBox = content => {
  ui.textArea.value = content;
  validateInputText(ui.textArea);
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
      const el = createSection(reply.speaker.class, reply.quote);
      insertReply(el);

      el.scrollIntoView({
        behavior: 'smooth',
      });
    });

    // clean up the UI
    clearQuestionText();
    getSuggestions(3);
    validateInputText();
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
