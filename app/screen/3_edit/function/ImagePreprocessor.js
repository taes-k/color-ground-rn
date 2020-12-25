import React from 'react';
import { Dimensions } from 'react-native';
import ImageEditor from "@react-native-community/image-editor";
import ImageSize from 'react-native-image-size'
import RNFS from 'react-native-fs';

const getResizeImage = async (imagePath) =>
{
    return await cropImage(imagePath);
}

const cropImage = async (imagePath) => 
{
    var { width, height } = await getImageSize(imagePath);

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
    };

    var res = await getCropImage(imagePath, cropData);
    return res;
}

const getCropImage = async (imagePath, cropData) =>
{
    const imageUrl = await ImageEditor.cropImage(imagePath, cropData);

    var result = { url: imageUrl };
    return result;
}


const getBase64FromFilePath = async (imagePath) => new Promise(resolve =>
{
    RNFS.readFile(imagePath, 'base64')
        .then(res => resolve(res));

})

const getImageSize = async (imagePath) =>
{
    if (imagePath.startsWith('content://'))
    {
        imagePath = await converContentUrlToFileUrl(imagePath);
    }

    return await ImageSize.getSize(imagePath);
}

const converContentUrlToFileUrl: (String) = async (url) =>
{
    const urlComponents = url.split('/')
    const fileNameAndExtension = urlComponents[urlComponents.length - 1]
    const destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`
    await RNFS.copyFile(url, destPath);
    return 'file://' + destPath;
}

export default { getResizeImage, getBase64FromFilePath, getImageSize };