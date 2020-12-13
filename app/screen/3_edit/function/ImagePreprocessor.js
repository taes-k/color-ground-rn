import React from 'react';
import { Dimensions } from 'react-native';
import ImageEditor from "@react-native-community/image-editor";
import { Image } from 'react-native';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native'

const getResizeImage = async (imagePath) =>
{
    return await cropImage(imagePath);
}

const cropImage = async (imagePath) => 
{
    var [width, height] = await getImageSize(imagePath);
    var squareSize = Math.min(width, height);
    var offsetX;
    var offsetY;

    if (squareSize == width)
    {
        offsetX = 0;
        offsetY = (height - squareSize) / 2;
    }
    else
    {
        offsetX = (width - squareSize) / 2;
        offsetY = 0;
    }

    var cropData = {
        offset: { x: offsetX, y: offsetY },
        size: { width: squareSize, height: squareSize },
        // displaySize: { width: Dimensions.get('window').width, height: Dimensions.get('window').width },
    };

    var res = await getCropImage(imagePath, cropData);
    console.log("RESRSERS ", res);
    return res;
}

const getCropImage = async(imagePath, cropData) => {
    var type;
    var data;

    const url = await ImageEditor.cropImage(imagePath, cropData);

    if (Platform.OS === 'ios') 
    {
        type = 'path';
        data = url;
        // resolve(url);
    }
    else
    {
        data = await getBase64FromFilePath(url);
    }

    var result = { type: type, data: data };
    return result;
}

// const getCropImage = async (imagePath, cropData) => new Promise(resolve =>
// {
//     ImageEditor.cropImage(imagePath, cropData).then(url =>
//     {
//         var type;
//         var data;

//         if (Platform.OS === 'ios') 
//         {
//             type = 'path';
//             data = url;
//             // resolve(url);
//         }
//         else
//         {
//             data = await getBase64FromFilePath(url);
//         }

//         var result = { type: type, data: data };
//         resolve(result);
//     })
// })

const getBase64FromFilePath = async (imagePath) => new Promise(resolve =>
{
    RNFS.readFile(imagePath, 'base64')
        .then(res => resolve(res));

})

const getImageSize = async (imagePath) => new Promise(resolve =>
{
    Image.getSize(imagePath, (width, height) =>
    {
        resolve([width, height]);
    });
})

const getBase64ImageSize = async (imagePath) => new Promise(resolve =>
{
    Image.getSize("data:image/jpeg;base64," + imagePath, (width, height) =>
    {
        resolve([width, height]);
    });
})

export default { getResizeImage, getImageSize, getBase64ImageSize };