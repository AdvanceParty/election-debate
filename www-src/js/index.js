const { initInterview } = require('./interview');
const { QUERY } = require('./config');
const { dQuery, dQueryAll } = require('./util');

const init = () => {
  initNavToggleButtons();
  initInterviewUI();
};

const initNavToggleButtons = () => {
  const toggleElements = dQueryAll(QUERY.DATA_ATTRIBUTES.NAV_TOGGLE);
  Array.from(toggleElements).map(el => (el.onclick = toggleNav));
};

const initInterviewUI = () => {
  if (dQuery(QUERY.IDS.INTERVIEW)) {
    initInterview(dQuery(QUERY.IDS.INTERVIEW));
  }
};

const toggleNav = async e => {
  const toggleClass = QUERY.CLASSES.NAV_OPEN;
  const toggleElements = dQuery(QUERY.DATA_ATTRIBUTES.NAV_TOGGLE);
  const navPanel = dQuery(QUERY.IDS.NAV_PANEL);

  navPanel.classList.toggle(toggleClass);
  Array.from(toggleElements).map(btn => btn.classList.toggle(toggleClass));
};

init();
