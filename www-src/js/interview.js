const { shuffle } = require('./util');
const { ENDPOINTS } = require('./config');

let state = {
  loading: null,
  validInput: null,
};

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

  setState({ loading: false });

  validateInputText(ui.textArea);
  getSuggestions(3);
};

const onInputValidationChange = () => {
  updateSubmitButtonState();
};

const onLoadingStateChange = () => {
  updateContainerClassList();
  updateSubmitButtonState();
};

const updateContainerClassList = () => {
  const { loading } = state;
  loading
    ? ui.interviewContainer.classList.add('loading')
    : ui.interviewContainer.classList.remove('loading');
};

const updateSubmitButtonState = () => {
  const { loading, validInput } = state;
  ui.submitButton.disabled = loading || !validInput;
};

const setState = updaterObject => {
  const oldState = { ...state };
  const newState = { ...state, ...updaterObject };
  state = newState;

  // ToDo: could just iterate object keys and fire on[key]change
  if (oldState.loading != newState.loading) {
    onLoadingStateChange();
  }
  if (oldState.validInput != newState.validInput) {
    onInputValidationChange();
  }
};

const validateInputText = inputElement => {
  const isValid = inputElement.value.length >= 5;
  setState({ validInput: isValid });
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

const callAPI = (endpoint, body) => {
  return new Promise(async function(resolve, reject) {
    setState({ loading: true });
    try {
      const response = await fetch(endpoint, { method: 'post', body });
      const data = await response.json();
      resolve(data);
    } catch (e) {
      reject(Error('*****WARNING******\n > Netlify lamba funcs are not available!'));
    } finally {
      setState({ loading: false });
    }
  });
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
    const questionText = getQuestionText();

    clearQuestionText();
    validateInputText(ui.textArea);

    const fetchBody = JSON.stringify({ question: questionText });
    const replies = await callAPI(ENDPOINTS.GET_REPLIES, fetchBody);

    const questionEl = createSection('question', questionText, '');
    insertReply(questionEl);

    replies.map(reply => {
      const el = createSection(reply.speaker.class, reply.quote);
      insertReply(el);
    });

    // questionEl.scrollIntoView({
    //   behavior: 'smooth',
    // });

    // clean up the UI
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
