// File: statuses.js
export const statuses = ['Designed', 'Drilled', 'Charged', 'Bogging', 'Complete'];
export const marks = statuses.map((label, idx) => ({ value: idx, label }));

export const cardOrder = ['activity', 'conditions', 'design', 'drilling', 'charging', 'bogging', 'geology', 'geotechnical'];

// 4) Which statuses show which cards
export const cardVisibility = {
  Abandoned: ['activity', 'design', 'drilling'],
  Designed: ['activity', 'design', 'drilling', 'geology', 'geotechnical'],
  Drilled: ['activity', 'design', 'drilling', 'geology', 'geotechnical', 'conditions'],
  Charged: ['activity', 'design', 'drilling', 'charging', 'geology', 'geotechnical', 'conditions'],
  Bogging: ['activity', 'design', 'drilling', 'charging', 'bogging', 'geology', 'geotechnical', 'conditions'],
  Complete: ['activity', 'design', 'drilling', 'charging', 'bogging', 'geology', 'geotechnical']
};

export const roleEdit = {
  'Mine Captain': ['conditions'],
  'Production Shiftboss': ['conditions'],
  'Operations Shiftboss': ['drilling'],
  'Production Engineer': ['activity', 'design', 'drilling', 'charging', 'geology', 'geotechnical', 'conditions'],
  'Geotechnical Engineer': ['geotechnical', 'conditions'],
  Geologist: ['geology', 'conditions'],
  Surveyor: ['drilling']
};
