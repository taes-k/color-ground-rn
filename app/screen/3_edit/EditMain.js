import React, { useCallback, useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, ImageBackground, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CameraRoll from "@react-native-community/cameraroll";
import ViewShot from 'react-native-view-shot';
import GetPixelColor from 'react-native-get-pixel-color';

import FlexStyles from '../../style/FlexStyleSheet';
import ExtractImageColor from './ExtractImageColor';
import InitialColor from './function/InitialColor';

const EditMain = ({ navigation, route }) =>
{
  const { imagePath } = route.params;

  const [initialReady, setInitialReady] = useState(false);

  const [initial3Colors, setInitial3Colors] = useState([]);
  const [colorChip1, setColorChip1] = useState({});
  const [colorChip2, setColorChip2] = useState({});
  const [colorChip3, setColorChip3] = useState({});

  const [preview, setPreview] = useState(null);

  const [colorchipRotate, setColorchipRotate] = useState(0);
  const [locationDisplay, setLocationDisplay] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState(false);

  const [pickColorChip, setPickColorChip] = useState({ coordX: 0, coordY: 0, hexColor: '#FFFFFF', red: 256, green: 256, blue: 256, hue: 0, saturation: 1, brightness: 1 })
  const [pickColorChipDisplay, setPickColorChipDisplay] = useState(false);
  const [pickedColorChipNumber, setPickedColorChipNumber] = useState(0);


  // ---------------------------------------------------------------------------------------------
  // initial colorchip setting
  // ---------------------------------------------------------------------------------------------

  useEffect(() =>
  {
    console.log("INITAIL READY 2:", initialReady);
    async function initColors()
    {
      await InitialColor.getInitial3Colors(imagePath, (x) => { setInitialReady(x) }, (x) => { setInitial3Colors(x) });
      setInitialReady(true);
    }

    if (initialReady == false)
    {
      GetPixelColor.setImage(imagePath);
      initColors();
    }
    else
    {
      setInitialColorChips();
    }
  }, [initialReady]);


  var colorChip1Style = {};
  var colorChip1Style = {};
  var colorChip1Style = {};

  const setInitialColorChips = () =>
  {
    console.log("initailColor1", initial3Colors[0]);
    console.log("initailColor2", initial3Colors[1]);
    console.log("initailColor3", initial3Colors[2]);

    setColorChip1(initial3Colors[0]);
    setColorChip2(initial3Colors[1]);
    setColorChip3(initial3Colors[2]);
  }

  var colorChip1Style = {
    backgroundColor: colorChip1.hexColor,
    borderColor: '#FFFFFF',
    borderStyle: 'solid',
    borderWidth: pickedColorChipNumber == 1 & pickColorChipDisplay ? 1 : 0,
  }

  var colorChip2Style = {
    backgroundColor: colorChip2.hexColor,
    borderColor: '#FFFFFF',
    borderStyle: 'solid',
    borderWidth: pickedColorChipNumber == 2 & pickColorChipDisplay ? 1 : 0,
  }

  var colorChip3Style = {
    backgroundColor: colorChip3.hexColor,
    borderColor: '#FFFFFF',
    borderStyle: 'solid',
    borderWidth: pickedColorChipNumber == 3 & pickColorChipDisplay ? 1 : 0,
  }

  // ---------------------------------------------------------------------------------------------
  // div snapshot
  // ---------------------------------------------------------------------------------------------
  const snapshotTarget = useRef();
  const onCapture = useCallback(() =>
  {
    setPickColorChipDisplay(false);
    snapshotTarget.current.capture().then(uri =>
    {
      console.log(uri);
      saveImage(uri);
    });
  }, []);

  const saveImage = async (imgUri) =>
  {
    config = { type: 'photo', album: 'colorground' }
    // CameraRoll.save(imgUri, config);
    const result = await CameraRoll.save(imgUri);
    Alert.alert("사진이 갤러리에 저장되었습니다.");
  }

  // ---------------------------------------------------------------------------------------------
  // pick colorchip setting
  // ---------------------------------------------------------------------------------------------

  useEffect(() =>
  {
    switch(pickedColorChipNumber)
    {
      case 1:
        setColorChip1(pickColorChip);
        break;
      case 2:
        setColorChip2(pickColorChip);
        break;
      case 3:
        setColorChip3(pickColorChip);
        break;
        
    }
  }, [pickColorChip])

  const onColorchipTouchEvent = (number) =>
  {

    if (pickColorChipDisplay == false || pickedColorChipNumber != number)
    {
      setPickedColorChipNumber(number);
      switch (number)
      {
        case 1:
          var coordX = colorChip1.coordX;
          var coordY = colorChip1.coordY;
          var hexColor = colorChip1.hexColor;
          var red = colorChip1.red;
          var green = colorChip1.green;
          var blue = colorChip1.blue;
          var hue = colorChip1.hue;
          var saturation = colorChip1.saturation;
          var brightness = colorChip1.brightness;

          setPickColorChip({ coordX: coordX, coordY: coordY, hexColor: hexColor, red: red, green: green, blue: blue, hue: hue, saturation: saturation, brightness: brightness });
          break;
        case 2:
          var coordX = colorChip2.coordX;
          var coordY = colorChip2.coordY;
          var hexColor = colorChip2.hexColor;
          var red = colorChip2.red;
          var green = colorChip2.green;
          var blue = colorChip2.blue;
          var hue = colorChip2.hue;
          var saturation = colorChip2.saturation;
          var brightness = colorChip2.brightness;

          setPickColorChip({ coordX: coordX, coordY: coordY, hexColor: hexColor, red: red, green: green, blue: blue, hue: hue, saturation: saturation, brightness: brightness });
          break;
        case 3:
          var coordX = colorChip3.coordX;
          var coordY = colorChip3.coordY;
          var hexColor = colorChip3.hexColor;
          var red = colorChip3.red;
          var green = colorChip3.green;
          var blue = colorChip3.blue;
          var hue = colorChip3.hue;
          var saturation = colorChip3.saturation;
          var brightness = colorChip3.brightness;

          setPickColorChip({ coordX: coordX, coordY: coordY, hexColor: hexColor, red: red, green: green, blue: blue, hue: hue, saturation: saturation, brightness: brightness });
          break;
      }

      setPickColorChipDisplay(true);
    }
    else
    {
      setPickColorChipDisplay(false);
    }
  }

  const onPhotoTouchEvent = (name, ev) =>
  {
    if (pickColorChipDisplay == true)
    {
      coordX = ev.nativeEvent.locationX;
      coordY = ev.nativeEvent.locationY;

      var color;
      GetPixelColor
        .pickColorAt(coordX, coordY)
        .then(res =>
        {
          color = res;
          movePickColorChip(coordX, coordY, color);
        });
    }
  }

  var pickChipStyle = {
    position: 'absolute',
    backgroundColor: pickColorChip.hexColor,
    left: pickColorChip.coordX - 22,
    top: pickColorChip.coordY - 22,
    display: pickColorChipDisplay == true ? 'flex' : 'none',
  };

  const movePickColorChip = (x, y, color) =>
  {
    setPickColorChip({ coordX: x, coordY: y, hexColor: color, red: 0, green: 0, blue: 0, hue: 0, saturation: 0, brightness: 0 });
  }

  const correctionCoord = (x, y) => 
  {
    var scale = 1;

  }

  // ---------------------------------------------------------------------------------------------
  return (
    <SafeAreaView style={[FlexStyles.flex_1]} >
      <View style={[FlexStyles.flex_4]}>
        <View style={[styles.option_tap]}>

        </View>

        <ViewShot ref={snapshotTarget} style={[styles.image_container]}>
          <ImageBackground
            style={[styles.image_view]}
            source={{ uri: imagePath }}
            onStartShouldSetResponder={(ev) => true}
            onResponderGrant={onPhotoTouchEvent.bind(this, "onResponderGrant")}
            onResponderMove={onPhotoTouchEvent.bind(this, "onResponderMove")}>
            <View style={[styles.color_chip, pickChipStyle]}></View>
            <View style={[styles.color_chip_box]}>
              <TouchableOpacity
                style={[styles.color_chip, colorChip1Style]}
                onPress={() => onColorchipTouchEvent(1)}
              />
              <TouchableOpacity
                style={[styles.color_chip, colorChip2Style]}
                onPress={() => onColorchipTouchEvent(2)}
              />
              <TouchableOpacity
                style={[styles.color_chip, colorChip3Style]}
                onPress={() => onColorchipTouchEvent(3)}
              />
            </View>
          </ImageBackground>
        </ViewShot>
      </View>

      <View style={[FlexStyles.flex_2]}>
        <Button title="Go back" onPress={() => navigation.goBack()} />
        <Button title="save" onPress={() => onCapture()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  option_tap: {
    backgroundColor: 'blue',
    height: 60
  },
  image_container: {
    flexDirection: 'row',
  },
  image_view: {
    flex: 1,
    aspectRatio: 1,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  color_chip_box: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 44 / 2,
  },
  color_chip: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    backgroundColor: 'red',
    marginRight: 15,
  }
});

export default EditMain;