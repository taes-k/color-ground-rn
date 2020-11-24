import React from 'react';
import { Dimensions } from 'react-native';
import ImageEditor from "@react-native-community/image-editor";
import { Image } from 'react-native';

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

    return await getCropImage(imagePath, cropData);
}

const getCropImage = async (imagePath, cropData) => new Promise(resolve =>
{
    ImageEditor.cropImage(imagePath, cropData).then(url =>
    {
        resolve(url);
    })
})

const getImageSize = async (imagePath) => new Promise(resolve =>
{
    Image.getSize(imagePath, (width, height) =>
    {
        resolve([width, height]);
    });
})


export default { getResizeImage, getImageSize };