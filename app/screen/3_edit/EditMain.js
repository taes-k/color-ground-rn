import React, { useCallback, useState, useRef, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, ImageBackground, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView, withSafeAreaInsets } from 'react-native-safe-area-context';
import CameraRoll from "@react-native-community/cameraroll";
import ViewShot from 'react-native-view-shot';
import GetPixelColor from 'react-native-get-pixel-color';
import Toast from 'react-native-toast-message';

import FlexStyles from '../../style/FlexStyleSheet';
import ExtractImageColor from './ExtractImageColor';
import InitialColor from './function/InitialColor';
import ImagePreprocessor from './function/ImagePreprocessor';

const EditMain = ({ navigation, route }) =>
{
  const { imagePath } = route.params;
  const [imageScale, setImageScale] = useState(1);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  const [toastReady, setToastReady] = useState(false);
  const [toastMessageText, setToastMessageText] = useState('');
  const [toastMessageOffsetY, setToastMessageOffsetY] = useState(0);

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
    async function initEdit()
    {
      await InitialColor.getInitial3Colors(imagePath, (x) => { setInitialReady(x) }, (x) => { setInitial3Colors(x) });

      var [width, height] = await ImagePreprocessor.getImageSize(imagePath);
      var scale = width / Dimensions.get('window').width;

      console.log("scale", scale);
      setImageScale(scale);
      setInitialReady(true);
    }
    if (initialReady == false)
    {
      GetPixelColor.setImage(imagePath);
      initEdit();
    }
    else
    {
      setInitialColorChips();
      setBackgroundColor(`rgba(${initial3Colors[0].red}, ${initial3Colors[0].green}, ${initial3Colors[0].blue}, 0.5)`);

    }

    return () => setInitialReady(true);
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

  var backgroundColorStyle = {
    backgroundColor: backgroundColor,
  }

  var colorChip1Style = {
    backgroundColor: colorChip1.hexColor,
    borderColor: '#FFFFFF',
    borderStyle: 'solid',
    borderWidth: pickedColorChipNumber == 1 & pickColorChipDisplay ? 2 : 0,
  }

  var colorChip2Style = {
    backgroundColor: colorChip2.hexColor,
    borderColor: '#FFFFFF',
    borderStyle: 'solid',
    borderWidth: pickedColorChipNumber == 2 & pickColorChipDisplay ? 2 : 0,
  }

  var colorChip3Style = {
    backgroundColor: colorChip3.hexColor,
    borderColor: '#FFFFFF',
    borderStyle: 'solid',
    borderWidth: pickedColorChipNumber == 3 & pickColorChipDisplay ? 2 : 0,
  }


  // ---------------------------------------------------------------------------------------------
  // toast message
  // ---------------------------------------------------------------------------------------------

  useEffect(() =>
  {
    if (initialReady == true && toastReady == false)
    {
      setToastPosition();
    }
    if (toastReady == true)
    {
      setToastMessageText('원을 눌러 원하는 컬러를 직접 선택해 보세요.');
      console.log("AASDF");
      showToastMessage();
    }
  }, [toastReady, initialReady]);


  useEffect(() =>
  {
    if (pickColorChipDisplay == true)
    {
      setToastMessageText('원을 한번 더 누르면 편집 모드가 종료됩니다.');
      showToastMessage();
    }
    else
    {
      Toast.hide({
        onHide: () => { }
      });
    }
  }, [pickColorChipDisplay]);

  const cref = useRef();

  const setToastPosition = () =>
  {
    cref.current.measure((width, height, px, py, fx, fy) =>
    {
      const location = {
        fx: fx,
        fy: fy,
        px: px,
        py: py,
        width: width,
        height: height
      }
      console.log(location);
      console.log("SET OFFSET", fy)
      setToastMessageOffsetY(fy);
      setToastReady(true)
    });
  };

  const showToastMessage = () =>
  {
    Toast.show({
      topOffset: toastMessageOffsetY,
      visibilityTime: 1000,
    });
  }

  const toastConfig = {
    success: (internalState) => (
      <View style={{
        height: 50, 
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Text style={{
          color: '#FFFFFF',
          textAlignVertical: "center",
          textAlign: "center"
        }}>{toastMessageText}</Text>
      </View>
    ),
    error: () => { },
    info: () => { },
    any_custom_type: () => { }
  };

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
    switch (pickedColorChipNumber)
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
        .pickColorAt(Math.round(coordX * imageScale), Math.round(coordY * imageScale))
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
    left: pickColorChip.coordX - 25,
    top: pickColorChip.coordY - 25,
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
    <SafeAreaView style={[FlexStyles.flex_1, backgroundColorStyle]} >
      <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
      <View style={[FlexStyles.flex_1]} ref={cref} >
        <View style={[styles.option_tap]}>

        </View>
        <ViewShot ref={snapshotTarget} style={[styles.image_container]}>
          <ImageBackground
            style={[styles.image_view]}
            source={{ uri: imagePath }}
            onStartShouldSetResponder={(ev) => true}
            onResponderGrant={onPhotoTouchEvent.bind(this, "onResponderGrant")}
            onResponderMove={onPhotoTouchEvent.bind(this, "onResponderMove")}>
            <View style={[styles.color_pick_chip, pickChipStyle]}>
              <Text style={[styles.color_pick_chip_text]}>+</Text>
            </View>
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
      <View style={[FlexStyles.flex_1, styles.edit_bottom]}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
            <Image 
            source={require('./images/cancel.png')}
            style={[styles.edit_bottom_image]}
            />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={() => onCapture()}>
            <Image 
            source={require('./images/download.png')}
            style={[styles.edit_bottom_image]}
            />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}>
            <Image 
            source={require('./images/share.png')}
            style={[styles.edit_bottom_image]}
            />
        </TouchableOpacity>
      </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  option_tap: {
    // backgroundColor: 'blue',
    height: 50
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
  },
  color_pick_chip: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    justifyContent: "center",
    alignItems: "center",
    borderColor: '#FFFFFF',
    borderStyle: 'solid',
    borderWidth: 2,

  },
  color_pick_chip_text: {
    fontSize: 25,
    fontWeight: "200",
    color: "white",
    textAlignVertical: "center",
    textAlign: "center"
  },
  edit_bottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  edit_bottom_image:{
    width:30,
    height: 30
  }
});

export default EditMain;