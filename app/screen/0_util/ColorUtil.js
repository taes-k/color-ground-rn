import React from 'react';
import GetPixelColor from 'react-native-get-pixel-color';


export const pickColorAt = (x, y) => new Promise((resolve, reject) => {
  pixelColor.getRGB(x, y, (err, color) => {
    if (err) {
      return reject(err);
    }
    resolve(rgb2hex(color).toUpperCase());
  });
});

export default {
  setImage,
  pickColorAt,
};