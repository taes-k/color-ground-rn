import React from 'react';
import { Dimensions } from 'react-native';
import ImageEditor from "@react-native-community/image-editor";
import ImageSize from 'react-native-image-size'
import RNFS from 'react-native-fs';

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
    const urlComponents = url.split('/');
    const fileNameAndExtension = urlComponents[urlComponents.length - 1];
    const destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`;
    await RNFS.copyFile(url, destPath);
    return 'file://' + destPath;
}

export default { getBase64FromFilePath, converContentUrlToFileUrl, getImageSize };