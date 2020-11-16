import React, { useState } from 'react';
import { Image } from 'react-native';

export const getImageSize = (imagePath) => {
    console.log("getsize start / ", imagePath);

    // const getImageSize = new Promise(
    //     (resolve, reject) => {
    //       Image.getSize(imagePath, (width, height) => {
    //         resolve({ width, height });
    //       });
    //     },
    //     (error) => reject(error)
    //   );

    //     const { width, height } = yield getImageSize;
    const xxx = Image.resolveAssetSource({uri:imagePath});
    console.log("width/height", xxx);
        alert(width);

        // console.log(`width ${width}, height ${height}`);
      console.log("getsize fin / ",getImageSize);
      
    return getImageSize;
      
    // const [size, setSize] = useState(null);

    // console.log("getsize start / ", imagePath);
    // Image.getSize(imagePath, (width, height) => {
    //     console.log("width/height",width,height);
    //     setSize({width, height});
    // });

    // console.log("getsize fin / ",size);
    // return size;
}

export default {
    getImageSize,
};
  