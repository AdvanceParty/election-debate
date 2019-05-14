const questionElId = 'question';
const ENDPOINTS = {
  GET_REPLIES: '/.netlify/functions/getReplies',
};

const ui = {
  interviewContainer: null,
  submitButton: null,
  textArea: null,
};

const initInterview = interviewContainer => {
  ui.interviewContainer = interviewContainer;
  ui.textArea = interviewContainer.querySelectorAll('textArea')[0];
  ui.submitButton = interviewContainer.querySelectorAll('button')[0];
  ui.submitButton.onclick = e => {
    getReplies();
  };
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
