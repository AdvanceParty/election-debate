const ENDPOINTS = {
  GET_REPLIES: '/.netlify/functions/getReplies',
};

const setMessage = (quote, speakerInfo) => {
  // const inner = document.querySelector('#pitchContent');
  // inner.innerHTML = msg;
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
  console.log(`Is loading: ${isLoading}`);
};

const getReplies = async () => {
  try {
    const replies = await callAPI(ENDPOINTS.GET_REPLIES);
  } catch (e) {
    console.log(e.message);
  }

  try {
    replies.map(reply => {
      setMessage(reply.quote, reply.speaker);
    });
  } catch (e) {
    console.log(e.message);
  }
};

const test = () => {
  getReplies();
};

test();
