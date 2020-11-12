import React, { useCallback, useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, ImageBackground, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CameraRoll from "@react-native-community/cameraroll";
import ViewShot from 'react-native-view-shot';
import GetPixelColor from 'react-native-get-pixel-color';

import FlexStyles from '../../style/FlexStyleSheet';
import ExtractImageColor from './ExtractImageColor';
import InitialColor from './function/InitialColor';

const EditMain = ({ navigation, route }) =>
{

  const [initialReady, setInitialReady] = useState(false);
  const [initial3Colors, setInitial3Colors] = useState([]);
  const [colorChip1, setColorChip1] = useState([]);
  const [colorChip2, setColorChip2] = useState({});
  const [colorChip3, setColorChip3] = useState({});

  const [preview, setPreview] = useState(null);

  const [colorchipRotate, setColorchipRotate] = useState(0);
  const [locationDisplay, setLocationDisplay] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState(false);

  const [pickColor, setPickColor] = useState('#FFFFFF');
  const [pickLocateX, setPickLocateX] = useState(0);
  const [pickLocateY, setPickLocateY] = useState(0);

  const { imagePath } = route.params;

  // ---------------------------------------------------------------------------------------------
  // initial colorchip setting
  // ---------------------------------------------------------------------------------------------

  useEffect(() =>
  {
    console.log("INITAIL READY 2:", initialReady);
    async function initColors()
    {
      await InitialColor.getInitial3Colors(imagePath, (x) => { setInitialReady(x) }, (x) => { setInitial3Colors(x) });
      initialReady(true);
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

  var initialColorChip1Style = {
    position: 'absolute',
    backgroundColor: pickColor,
    left: pickLocateX,
    top: pickLocateY,
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
  };

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
  }

  var colorChip2Style = {
    backgroundColor: colorChip2.hexColor,
  }

  var colorChip3Style = {
    backgroundColor: colorChip3.hexColor,
  }

  // ---------------------------------------------------------------------------------------------
  // div snapshot
  // ---------------------------------------------------------------------------------------------
  const snapshotTarget = useRef();
  const onCapture = useCallback(() =>
  {
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
  const onTouchEvent = (name, ev) =>
  {
    coordX = ev.nativeEvent.locationX;
    coordY = ev.nativeEvent.locationY;

    var color;
    GetPixelColor
      .pickColorAt(coordX, coordY)
      .then(res =>
      {
        color = res;
        movePickChip(coordX, coordY, color);
      });
  }

  var pickChipStyle = {
    position: 'absolute',
    backgroundColor: pickColor,
    left: pickLocateX - 22,
    top: pickLocateY - 22,
  };

  const movePickChip = (x, y, color) =>
  {
    setPickColor('#00FF00');
    setPickColor(color);
    setPickLocateX(x);
    setPickLocateY(y);
  }

  // ---------------------------------------------------------------------------------------------
  return (
    <SafeAreaView style={[FlexStyles.flex_1]} >
      <View style={[FlexStyles.flex_4]}>
        <View style={[styles.option_tap]}>

        </View>

        <ViewShot ref={snapshotTarget} style={[styles.image_container]}>
          {/* <TouchableOpacity onPress={(e) => {console.log('touchMove',e.nativeEvent)}}> */}
          <ImageBackground
            style={[styles.image_view]}
            source={{ uri: imagePath }}
            onStartShouldSetResponder={(ev) => true}
            onResponderGrant={onTouchEvent.bind(this, "onResponderGrant")}
            onResponderMove={onTouchEvent.bind(this, "onResponderMove")}>
            <View style={[styles.color_chip, pickChipStyle]}></View>
            <View style={[styles.color_chip_box]}>
              <View style={[styles.color_chip, colorChip1Style]}></View>
              <View style={[styles.color_chip, colorChip2Style]}></View>
              <View style={[styles.color_chip, colorChip3Style]}></View>
            </View>
          </ImageBackground>
          {/* </TouchableOpacity> */}
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
    borderColor: '#FFFFFF',
    borderStyle: 'solid',
    borderWidth: 1,
    marginRight: 15,
  }
});

export default EditMain;