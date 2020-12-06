import React, { useState, useSelector, useEffect } from 'react';
import { useCallback } from 'react-redux';
import { Image, Dimensions } from 'react-native';

import GetPixelColor from 'react-native-get-pixel-color';

import ImageSize from './ImageSize';
import PickColor from './PickColor';

const getInitialColors = async (imagePath, setInitialReady, setInitialColors) =>
{
    await GetPixelColor.setImage(imagePath);
    var initialColors = await getInitailColors(imagePath);

    setInitialColors(initialColors);
    setInitialReady(true);
}

const getInitailColors = async (imagePath) =>
{
    var [width, height] = await getImageSize(imagePath);
    var colors = await getSampleColors(imagePath, width, height);
    var initialColors = getInitialSampleColors(colors)

    console.log("INITCOLORS : ", initialColors);
    return initialColors;
}

const getImageSize = async (imagePath) => new Promise(resolve =>
{
    Image.getSize(imagePath, (width, height) =>
    {
        resolve([width, height]);
    });
})

const getSampleColors = async (imagePath, width, height) =>
{
    var pickSize = 20;
    var colors = [];
    var pickCount = 0;
    var widthTerm = Math.floor(width / pickSize);
    var heightTerm = Math.floor(height / pickSize);
    var scale = width / Dimensions.get('window').width;

    for (x = 1; x <= pickSize; x++)
    {
        for (y = 1; y <= pickSize; y++)
        {
            let coordX = widthTerm * x;
            let coordY = heightTerm * y;
            await GetPixelColor
                .pickColorAt(coordX, coordY)
                .then(res =>
                {
                    var color = res;
                    var red = parseInt(color.substring(1, 3), 16);
                    var green = parseInt(color.substring(3, 5), 16);
                    var blue = parseInt(color.substring(5, 7), 16);

                    var hsb = getHSBFromRGB(red, green, blue);

                    var colorObj = { coordX: Math.round(coordX / scale), coordY: Math.round(coordY / scale), hexColor: color, red: red, green: green, blue: blue, hue: hsb.hue, saturation: hsb.saturation, brightness: hsb.brightness };

                    colors.push(colorObj);
                });
        }
    }
    return colors;
}

const getInitialSampleColors = (colors) =>
{
    var tempPickColors = [];

    var colorsIdx = 0
    var pickIdx = 0

    var prePickHue1: Float
    var prePickHue2: Float

    var currentPickHue: Float
    var currentPickSaturation: Float
    var currentPickBrightness: Float

    var hueStandard = 60;
    var saturationStandard = 50;
    var brightnessStandard = 0.7;
    var maxLoopCountStandard = 7;


    colors.sort(function (a, b)
    {
        if (a.saturation > b.saturation)
        {
            return 1;
        }
        else
        {
            return -1;
        }
    });

    var loopCount = 1

    while (tempPickColors.length < 3 || loopCount <= maxLoopCountStandard)
    {
        if (tempPickColors.length > 10)
        {
            break;
        }
        if (loopCount > maxLoopCountStandard)
        {
            hueStandard = 0
            brightnessStandard = 0
            saturationStandard = 0
        }

        if (tempPickColors.length == 0)
        {
            var currentPickSaturation = colors[colorsIdx].saturation;
            var currentPickBrightness = colors[colorsIdx].brightness;

            if (currentPickSaturation >= saturationStandard && currentPickBrightness >= brightnessStandard)
            {
                tempPickColors.push(colors[colorsIdx]);
            }
        }
        else if (tempPickColors.length == 1)
        {
            var pickedColorHue1 = tempPickColors[0].hue;

            var currentPickHue = colors[colorsIdx].hue;
            var currentPickSaturation = colors[colorsIdx].saturation;
            var currentPickBrightness = colors[colorsIdx].brightness;

            if (Math.abs(pickedColorHue1 - currentPickHue) >= hueStandard
                && currentPickSaturation >= saturationStandard
                && currentPickBrightness >= brightnessStandard)
            {
                tempPickColors.push(colors[colorsIdx]);
            }
        }
        else
        {
            var pickedColorHue1 = tempPickColors[0].hue;
            var pickedColorHue2 = tempPickColors[1].hue;

            var currentPickHue = colors[colorsIdx].hue;
            var currentPickSaturation = colors[colorsIdx].saturation;
            var currentPickBrightness = colors[colorsIdx].brightness;

            if (Math.abs(pickedColorHue1 - currentPickHue) >= hueStandard
                && Math.abs(pickedColorHue2 - currentPickHue) >= hueStandard
                && currentPickSaturation >= saturationStandard
                && currentPickBrightness >= brightnessStandard)
            {
                tempPickColors.push(colors[colorsIdx]);
            }
        }

        colorsIdx++;
        if (colorsIdx >= colors.length)
        {
            hueStandard = hueStandard / 1.2
            saturationStandard = saturationStandard / 1.2
            brightnessStandard = brightnessStandard / 1.2

            colorsIdx = 0
            loopCount = loopCount + 1
        }
    }

    return tempPickColors;
}

const getHSBFromRGB = (red, green, blue) =>
{
    var hsb = {
        hue: 0,
        saturation: 0,
        brightness: 0,
    }
    red = red / 256;
    green = green / 256;
    blue = blue / 256;

    let maxRgb = Math.max(red, green, blue);
    let minRgb = Math.min(red, green, blue);
    let difRgb = maxRgb - minRgb

    var saturation = 0;
    var brightness = 0;

    if (maxRgb <= 0)
    {
        hsb.hue = 0
        hsb.saturation = 0
        hsb.brightness = 0
    }
    else
    {
        if (maxRgb == red && minRgb == blue)
        {
            if (difRgb == 0)
            {
                hsb.hue = 0;
            }
            else if (minRgb == blue)
            {
                hsb.hue = 60 * (green - blue) / difRgb;
            }
            else if (minRgb == green)
            {
                hsb.hue = 60 * (green - blue) / difRgb + 360;
            }
        }
        else if (maxRgb == green)
        {
            hsb.hue = 60 * (blue - red) / difRgb + 120;
        }
        else if (maxRgb == blue)
        {
            hsb.hue = 60 * (red - green) / difRgb + 240;
        }

        hsb.saturation = (maxRgb == 0) ? 0 : (1 - (minRgb / maxRgb)) * 100;
        hsb.brightness = maxRgb;
    }
    return hsb;
}

export default { getInitialColors };