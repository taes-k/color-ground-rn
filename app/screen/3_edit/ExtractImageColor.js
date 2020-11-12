import React, { useState } from 'react';
import { Image } from 'react-native';
import GetPixelColor from 'react-native-get-pixel-color';

export const getImageColor = (imageUrl) => {

} 

export const getImageSize = ({imageUrl}) => {
    const [size, setSize] = useState(null);

    Image.getSize(imagePath, (width, height) => {
        console.log(width,height);
        setSize({width, height});
    });

    return size;
}

export default {
    getImageColor,
    getImageSize,
  };
  