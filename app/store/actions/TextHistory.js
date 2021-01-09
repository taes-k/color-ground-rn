export const TEXT_HISTORY = 'TEXT_HISTORY';

export const SET_NEW_TEXT = 'SET_NEW_TEXT';
export const SET_TEXT_HISTORY = 'SET_TEXT_HISTORY';

export const setNewText = (text) => {
  return {
    type: SET_NEW_TEXT, 
    text: text,
    list: null,
  }
};

export const setTextHistory = (textList) => {
  return {
    type: SET_TEXT_HISTORY, 
    text: null,
    list: textList, 
  }
};