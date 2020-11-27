export const COLORING_LIMIT_COUNT = 'COLORING_LIMIT_COUNT';

export const SET_COUNT = 'SET_COUNT';
export const USE_COUNT = 'USE_COUNT';
export const ADD_COUNT = 'ADD_COUNT';

export const setCount = (cnt) => {
  return {
    type: SET_COUNT, 
    count: cnt,
  }
};

export const useCount = () => {
  return {
    type: USE_COUNT, 
  }
};

export const addCount = (cnt) => {
  return {
    type: ADD_COUNT, 
    count: cnt,
  }
};