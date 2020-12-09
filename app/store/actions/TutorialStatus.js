export const TUTORIAL_SUCCESS_STATUS = 'TUTORIAL_SUCCESS_STATUS';

export const SET_EDIT_TUTORIAL_SUCCESS = 'SET_EDIT_TUTORIAL_SUCCESS';
export const SET_TUTORIAL_STATUS = 'SET_TUTORIAL_STATUS';

export const setTutorialStatus = (status) => {
  return {
    type: SET_TUTORIAL_STATUS,
    status: status,
  }
};

export const setEditTutorialSuccess = () => {
  return {
    type: SET_EDIT_TUTORIAL_SUCCESS,
  }
};