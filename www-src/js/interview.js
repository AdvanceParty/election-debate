const ENDPOINTS = {
  GET_REPLIES: '/.netlify/functions/getReplies',
};

const setMessage = (quote, speakerInfo) => {
  // const inner = document.querySelector('#pitchContent');
  // inner.innerHTML = msg;
  console.log(`${speakerInfo.displayName} (class - ${speakerInfo.class}) says: ${quote}`);
};

const callAPI = async endpoint => {
  let message;
  setLoading(true);

  try {
    const response = await fetch(endpoint);
    message = await response.json();
  } catch (e) {
    message = 'Error connecting to lamba functions. Check your config.';
  } finally {
    setLoading(false);
    return message;
  }
};

const setLoading = isLoading => {
  // const wrapper = document.querySelector('#pitch');
  // isLoading ? wrapper.classList.add('loading') : wrapper.classList.remove('loading');
  console.log(`Is loading: ${isLoading}`);
};

const getReplies = async () => {
  const replies = await callAPI(ENDPOINTS.GET_REPLIES);

  replies.map(reply => {
    setMessage(reply.quote, reply.speaker);
  });
};

const test = () => {
  getReplies();
};

test();
