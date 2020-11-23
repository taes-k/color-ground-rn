import React from 'react';
import { Dimensions } from 'react-native';
import ImageEditor from "@react-native-community/image-editor";
import { Image } from 'react-native';

const SIZE_SCALE = 5;

const getResizeImage = async (imagePath) =>
{
    var [width, height] = await getImageSize(imagePath);
    var cropImageUrl = await cropImage(imagePath, { width: width, height: height });

    return cropImageUrl;
}

const cropImage = async (imagePath, originSize) => new Promise(resolve =>
{
    var squareSize = Math.min(originSize.width, originSize.height);
    var offsetX;
    var offsetY;

    if (squareSize == originSize.width)
    {
        offsetX = 0;
        offsetY = (originSize.height - squareSize) / 2;
    }
    else
    {
        offsetX = (originSize.width - squareSize) / 2;
        offsetY = 0;
    }

    var displaySize =
    {
        width: Dimensions.get('window').width * SIZE_SCALE,
        height: Dimensions.get('window').width * SIZE_SCALE,
    };

    console.log("display scale", displaySize)

    var cropData = {
        offset: { x: offsetX, y: offsetY },
        size: { width: squareSize, height: squareSize },
        displaySize: { width: Dimensions.get('window').width, height: Dimensions.get('window').width },
    };

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


export default { getResizeImage, SIZE_SCALE};