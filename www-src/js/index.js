const navpanelId = '#siteNav';
const navToggleSelector = "[data-action='toggleNav']";
const navOpenClassname = 'open';
const transitionDuration = 300;
const { initInterview, getReplies } = require('./interview');

const init = () => {
  const navToggles = Array.from(document.querySelectorAll(navToggleSelector));
  navToggles.map(el => (el.onclick = toggleNav));

  if (document.querySelector('#interview')) {
    initInterview(document.querySelector('#interview'));
  }
};

const toggleNav = async e => {
  console.log('toggle nav');
  document.querySelector(navpanelId).classList.toggle(navOpenClassname);

  const navToggles = Array.from(document.querySelectorAll(navToggleSelector));
  navToggles.map(btn => btn.classList.toggle(navOpenClassname));

  if (e.target.href !== undefined) {
    delayLinkEvent(e, transitionDuration);
  }
};

init();
