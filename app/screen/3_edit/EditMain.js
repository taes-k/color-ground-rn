import React, { useCallback, useState, useRef, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, ImageBackground, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView, withSafeAreaInsets } from 'react-native-safe-area-context';
import CameraRoll from "@react-native-community/cameraroll";
import ViewShot from 'react-native-view-shot';
import GetPixelColor from 'react-native-get-pixel-color';
import Share from 'react-native-share';

import FlexStyles from '../../style/FlexStyleSheet';
import ExtractImageColor from './ExtractImageColor';
import InitialColor from './function/InitialColor';
import ImagePreprocessor from './function/ImagePreprocessor';

const EditMain = ({ navigation, route }) =>
{
  const { imagePath } = route.params;
  const [imageScale, setImageScale] = useState(1);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  const [showToast, setShowToast] = useState(true);
  const [toastMessageText, setToastMessageText] = useState('원을 눌러 원하는 컬러를 직접 선택해보세요.');

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
    async function initEdit()
    {
      await InitialColor.getInitial3Colors(imagePath, (x) => { setInitialReady(x) }, (x) => { setInitial3Colors(x) });

      var [width, height] = await ImagePreprocessor.getImageSize(imagePath);
      var scale = width / Dimensions.get('window').width;

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

  const toastContainerStyle = {
    display: showToast ? 'flex' : 'none',
  }

  // ---------------------------------------------------------------------------------------------
  // div snapshot
  // ---------------------------------------------------------------------------------------------
  const snapshotTarget = useRef();
  const onCapture = useCallback(() =>
  {
    setPickColorChipDisplay(false);
    captureImage().then(res => saveImage(res));
  }, []);

  const captureImage = () => new Promise(resolve =>
  {
    snapshotTarget.current.capture().then(uri =>
    {
      resolve(uri);
    });
  })

  const saveImage = async (imgUri) =>
  {
    config = { type: 'photo', album: 'colorground' }
    // CameraRoll.save(imgUri, config);
    const result = await CameraRoll.save(imgUri);
    Alert.alert("사진이 갤러리에 저장되었습니다.");
  }

  // ---------------------------------------------------------------------------------------------
  // share image
  // ---------------------------------------------------------------------------------------------

  const shareImage = () =>
  {
    captureImage().then(res =>
    {
      openShare(res);
    })


  }

  const openShare = async (imgUri) =>
  {
    const options = {
      url: imgUri,
    };

    Share.open(options)
      .then((res) =>
      {
        console.log(res);
      })
      .catch((err) =>
      {
        err && console.log(err);
      });
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
    setToastMessageText('원을 한번 더 누르면 편집 모드가 종료됩니다.');

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
      setShowToast(false);
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
      <View style={[FlexStyles.flex_1]} >
        <View style={[styles.option_tap]}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
            <Image
              source={require('../../images/cancel.png')}
              style={[styles.edit_button_image]}
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={() => onCapture()}>
            <Image
              source={require('../../images/download.png')}
              style={[styles.edit_button_image]}
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={() => shareImage()}>
            <Image
              source={require('../../images/share.png')}
              style={[styles.edit_button_image]}
            />
          </TouchableOpacity>
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
                style={[styles.color_chip, styles.color_chip_mid, colorChip2Style]}
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
          <View style={[toastContainerStyle, styles.toast_container]}>
            <Text style={[styles.toast_text]}>{toastMessageText}</Text>
          </View>
          <TouchableOpacity style={[styles.edit_bottom_button_container]} activeOpacity={0.8}>
            {/* for align space */}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.edit_bottom_button_container]} activeOpacity={0.8}>
            <View style={[styles.edit_bottom_button]} >
              <Image
                source={require('../../images/text.png')}
                style={[styles.edit_button_image]}
              />
            </View>
            <Text style={[styles.edit_bottom_button_text]}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.edit_bottom_button_container]} activeOpacity={0.8}>
            <View style={[styles.edit_bottom_button]} >
              <Image
                source={require('../../images/shuffle.png')}
                style={[styles.edit_button_image]}
              />
            </View>
            <Text style={[styles.edit_bottom_button_text]}>shuffle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.edit_bottom_button_container]} activeOpacity={0.8}>
            {/* for align space */}
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  option_tap: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  edit_button_image: {
    width: 30,
    height: 30
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
  },
  color_chip_mid: {
    marginLeft: 15,
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
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  toast_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',

  },
  toast_text: {
    fontSize: 15,
    color: '#FFFFFF'

  },
  edit_bottom_button_container: {
    alignItems: 'center',
  },
  edit_bottom_button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  edit_bottom_button_text: {
    marginTop: 15,
    fontSize: 13,
  },
});

export default EditMain;