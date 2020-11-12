export const ADD_COLOR = 'ADD_COLOR';
export const CLEAR_COLORS = 'CLEAR_COLORS';

export const addColor = (coordX, coordY, red, green, blue, hue, saturation, brightness) => {
  return {
    type: ADD_COLOR,
    coordX: coordX,
    coordY: coordY, 
    red: red,
    gree: green,
    blue: blue,
    hue: hue,
    saturation: saturation,
    brightness: brightness
  }
};

export const clearColors = () => {
    return {
      type: CLEAR_COLORS
    }
  };