const ENDPOINTS = {
  GET_REPLIES: '/.netlify/functions/getReplies',
};

const setMessage = (quote, speakerInfo) => {
  // const inner = document.querySelector('#pitchContent');
  // inner.innerHTML = msg;
  console.log(`${speakerInfo.displayName} (class - ${speakerInfo.class}) says: ${quote}`);
};

const getReplies = async () => {
  const resp = await callAPI(ENDPOINTS.GET_REPLIES);
  console.log(resp);
  const replies = JSON.parse(resp);

  replies.map(reply => {
    console.log(reply);
    setMessage(reply.quote, reply.speaker);
  });
};

const callAPI = async endpoint => {
  setLoading(true);
  let message;
  try {
    const response = await fetch(endpoint);
    message = await response.json();
  } catch (e) {
    message = 'Something went wrong. Oops.';
  } finally {
    setLoading(false);
    return message;
  }
};

const setLoading = isLoading => {
  const wrapper = document.querySelector('#pitch');
  isLoading ? wrapper.classList.add('loading') : wrapper.classList.remove('loading');
};
