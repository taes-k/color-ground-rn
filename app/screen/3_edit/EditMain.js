import React, { useCallback, useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Platform, StyleSheet, View, Button, Image, ImageBackground, Animated, TextInput, Alert, TouchableOpacity, Dimensions, PermissionsAndroid, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Text from '../../components/CustomText';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, withSafeAreaInsets } from 'react-native-safe-area-context';
import CameraRoll from "@react-native-community/cameraroll";
import ViewShot from 'react-native-view-shot';
import GetPixelColor from 'react-native-get-pixel-color';
import Share from 'react-native-share';
import Modal from 'react-native-modal';
import Geolocation from '@react-native-community/geolocation';
import * as TutorialStatus from '../../store/actions/TutorialStatus';
import RNFS from 'react-native-fs';

import * as TextHistoryActions from '../../store/actions/TextHistory';

import TextModal from './TextModal';
import FlexStyles from '../../style/FlexStyleSheet';
import InitialColor from './function/InitialColor';
import ImagePreprocessor from './function/ImagePreprocessor';

const EditMain = ({ navigation, route }) =>
{
  const dispatch = useDispatch();

  const { imageData } = route.params;
  const imageSourcePath = imageData;
  const [imageScale, setImageScale] = useState(1);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  const tutorialSuccess = useSelector((state) => state.tutorialStatus.editTutorial);
  const [toastMessageText, setToastMessageText] = useState('원을 눌러 원하는 컬러를 직접 선택해보세요.');
  const [toastBlink, setToastBlink] = useState(false);

  const [initialReady, setInitialReady] = useState(false);

  const [initialColors, setInitialColors] = useState([]);
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

  // const [historyTextList, setHistoryTextList] = useState([]);
  const [gpsAddressList, setGpsAddressList] = useState([]);
  const [textModalShow, setTextModalShow] = useState(false);
  const [textValue, setTextValue] = useState('');

  // ---------------------------------------------------------------------------------------------
  // initial colorchip setting
  // ---------------------------------------------------------------------------------------------

  useEffect(() =>
  {
    async function initEdit()
    {
      var imageDict = {};
      if (Platform.OS === 'ios') 
      {
        imageDict = { url: imageData, data: imageData };
      }
      else
      {
        var base64Data = await ImagePreprocessor.getBase64FromFilePath(imageData);
        imageDict = { url: imageData, data: base64Data };
      }

      GetPixelColor.setImage(imageDict.data);
      await InitialColor.getInitialColors(imageDict, (x) => { setInitialReady(x) }, (x) => { setInitialColors(x) });

      var { width, height } = await ImagePreprocessor.getImageSize(imageDict.url);
      var scale = width / Dimensions.get('window').width;

      setImageScale(scale);
      setInitialReady(true);
    }

    if (initialReady == false)
    {

      initEdit();
    }
    else
    {
      setInitialColorChips();
      setBackgroundColor(`rgba(${initialColors[0].red}, ${initialColors[0].green}, ${initialColors[0].blue}, 0.5)`);

    }

    return () => setInitialReady(true);
  }, [initialReady]);

  var colorChip1Style = {};
  var colorChip1Style = {};
  var colorChip1Style = {};

  const setInitialColorChips = () =>
  {
    setColorChip1(initialColors[0]);
    setColorChip2(initialColors[1]);
    setColorChip3(initialColors[2]);
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

  const shuffleColorChip = () =>
  {

    var randomInt1 = getRandomInt(0, initialColors.length);
    var randomInt2 = getRandomInt(0, initialColors.length);
    while (randomInt1 == randomInt2)
    {
      randomInt2 = getRandomInt(0, initialColors.length);
    }
    var randomInt3 = getRandomInt(0, initialColors.length);
    while (randomInt1 == randomInt3 || randomInt2 == randomInt3)
    {
      randomInt3 = getRandomInt(0, initialColors.length);
    }

    setColorChip1(initialColors[randomInt1]);
    setColorChip2(initialColors[randomInt2]);
    setColorChip3(initialColors[randomInt3]);
  }

  const getRandomInt = (min, max) =>
  {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
  }
  // ---------------------------------------------------------------------------------------------
  // toast message
  // ---------------------------------------------------------------------------------------------

  const [toastOpacityAnimatedValue, setToastOpacityAnimatedValue] = useState(new Animated.Value(0));

  useEffect(() =>
  {
    setToastOpacityAnimatedValue(tutorialSuccess ? new Animated.Value(0) : new Animated.Value(1));
  }, [tutorialSuccess])

  useEffect(() =>
  {
    if (toastBlink == true)
    {
      fadeInToast();
      setTimeout(() =>
      {
        fadeOutToast();
      }, 1000);

      setToastBlink(false);
    }
  }, [toastBlink])

  const fadeInToast = () =>
  {
    Animated.timing(toastOpacityAnimatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  const fadeOutToast = async () =>
  {
    Animated.timing(toastOpacityAnimatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  const toastFadeOpacityStyle = {
    opacity: toastOpacityAnimatedValue
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
    if (Platform.OS === "android" && !(await hasAndroidPermission()))
    {
      return;
    }

    var config = { type: 'photo', album: 'colorground' }
    const result = await CameraRoll.save(imgUri, config);
    setToastMessageText("저장이 완료되었습니다.")

    setToastBlink(true);
  }

  const hasAndroidPermission = async () =>
  {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission)
    {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
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
    var imageFile = await RNFS.readFile(imgUri, 'base64');

    const options = {
      url: "data:image/jpeg;base64," + imageFile,
      failOnCancel: false,
    };

    Share.open(options)
      .then((res) =>
      {
        console.log("Share", res);
      })
      .catch((err) =>
      {
        err && console.log("Share Error", err);
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
      if (!tutorialSuccess)
      {
        fadeOutToast();
        dispatch(TutorialStatus.setEditTutorialSuccess());
      }
    }
  }

  // safe area 를 고려한 Y offset을 구하기 위한 작업
  const editViewRef = useRef();
  const [editViewRenderReady, setEditViewRenderReady] = useState(false);
  const [snapshotTargetLocationY, setSnapshotTargetLocationY] = useState(50);

  const setSnapshotTargetOffset = () =>
  {
    editViewRef.current.measure((width, height, px, py, fx, fy) =>
    {
      setSnapshotTargetLocationY(fy);
    });
  };

  useEffect(() =>
  {
    if (editViewRenderReady)
    {
      setSnapshotTargetOffset();
    }
  }, [editViewRenderReady])

  const viewWidth = Dimensions.get('window').width;
  const onPhotoTouchEvent = (name, ev) =>
  {
    if (pickColorChipDisplay == true)
    {
      var coordX = ev.nativeEvent.pageX;
      var coordY = ev.nativeEvent.pageY - snapshotTargetLocationY;

      if (coordY < 0) coordY = 0;
      if (coordY > viewWidth) coordY = viewWidth - 1;

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

  var pickChipContainerStyle = {
    position: 'absolute',
    left: pickColorChip.coordX - 25,
    top: pickColorChip.coordY - 25,
  };

  var pickChipStyle = {
    display: pickColorChipDisplay == true ? 'flex' : 'none',
    backgroundColor: pickColorChip.hexColor,
    borderWidth: pickColorChipDisplay == true ? 2 : 0,
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
  // stamp text setting
  // ---------------------------------------------------------------------------------------------

  const historyTextList = useSelector((state) => state.textHistory.list);
  const GOOGLE_MAP_API_KEY = "";

  useEffect(() =>
  {
    Geolocation.getCurrentPosition(info =>
    {
      getNearByPlace(info.coords.latitude + "," + info.coords.longitude);
    });
  }, [])

  const addTextHistory = (text) =>
  {
    dispatch(TextHistoryActions.setNewText(text));
  }

  const showTextSettingModal = () =>
  {
    setTextModalShow(true);
  }

  const hideTextSettingModal = () =>
  {
    setTextModalShow(false);
  }

  const getNearByPlace = (coords) =>
  {
    const googlePlaceUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    const languageParam = "language=en"
    const locationParam = "location="
    const radiusParam = "radius=200";
    const keyParam = "key=" + GOOGLE_MAP_API_KEY;

    const callUrl = googlePlaceUrl + '?' + languageParam + "&" + locationParam + coords + "&" + radiusParam + "&" + keyParam;

    return fetch(callUrl)
      .then((response) => response.json())
      .then((json) =>
      {
        var addressList = [];
        var results = json.results;

        for (var i = 0; i < results.length; i++)
        {
          addressList.push(results[i].name);
        }
        setGpsAddressList(addressList);
      })
      .catch((error) =>
      {
        console.error(error);
      });
  };

  const appendTextValue = (text) =>
  {
    var tempText = textValue;
    tempText += text;
    setTextValue(tempText);
  }

  const getTextHHMMSS: (String) = () =>
  {
    var date = new Date();

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    if (hours < 10)
    {
      hours = '0' + hours;
    }
    if (minutes < 10)
    {
      minutes = '0' + minutes;
    }
    if (seconds < 10)
    {
      seconds = '0' + seconds;
    }

    var text = hours + ":" + minutes + ":" + seconds;
    return text;
    // setTextValue(text);
  }

  const getTextYYYYMMDD: (String) = () =>
  {
    var date = new Date();

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var date = date.getDate();

    if (month < 10)
    {
      month = '0' + month;
    }
    if (date < 10)
    {
      date = '0' + date;
    }
    var text = year + "/" + month + "/" + date;
    return text;
    // setTextValue(text);
  }

  const confirmStampText = () =>
  {
    if (textValue && textValue.length > 0)
    {
      addTextHistory(textValue);
    }

    hideTextSettingModal()
  }

  const history1DisplayStyle = { display: historyTextList[0] && historyTextList[0].length > 0 ? 'flex' : 'none' };
  const history2DisplayStyle = { display: historyTextList[1] && historyTextList[1].length > 0 ? 'flex' : 'none' };
  const history3DisplayStyle = { display: historyTextList[2] && historyTextList[2].length > 0 ? 'flex' : 'none' };

  const gpsAddress1DisplayStyle = { display: gpsAddressList.length > 0 ? 'flex' : 'none' };
  const gpsAddress2DisplayStyle = { display: gpsAddressList.length > 1 ? 'flex' : 'none' };
  const gpsAddress3DisplayStyle = { display: gpsAddressList.length > 2 ? 'flex' : 'none' };

  // ---------------------------------------------------------------------------------------------

  const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  )

  return (
    <SafeAreaView style={[FlexStyles.flex_1, backgroundColorStyle]} >
      <View style={[FlexStyles.flex_1]} >
        <View style={[styles.option_tap]}>
          <TouchableOpacity style={[styles.button_container]} activeOpacity={1} onPress={() => navigation.goBack()}>
            <Image
              source={require('../../images/cancel.png')}
              style={[styles.edit_button_image]}
            />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_container]} activeOpacity={1} onPress={() => onCapture()}>
            <Image
              source={require('../../images/download.png')}
              style={[styles.edit_button_image]}
            />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_container]} activeOpacity={1} onPress={() => shareImage()}>
            <Image
              source={require('../../images/share.png')}
              style={[styles.edit_button_image]}
            />
          </TouchableOpacity>
        </View>
        <View ref={editViewRef} onLayout={(event) => setEditViewRenderReady(true)} />
        <ViewShot
          ref={snapshotTarget}
          style={[styles.image_container]} >
          <ImageBackground
            style={[styles.image_view]}
            source={{ uri: imageSourcePath }}
            onStartShouldSetResponder={(ev) => true}
            onResponderGrant={onPhotoTouchEvent.bind(this, "onResponderGrant")}
            onResponderMove={onPhotoTouchEvent.bind(this, "onResponderMove")}>
            <View style={[pickChipContainerStyle]} pointerEvents='none'>
              <View style={[styles.color_pick_chip, pickChipStyle]}>
                <Text style={[styles.color_pick_chip_text]}>+</Text>
              </View>
            </View>
            <View style={[styles.color_chip_box]}>
              <TouchableOpacity
                activeOpacity={1}
                style={[styles.color_chip, colorChip1Style]}
                onPress={() => onColorchipTouchEvent(1)}
              />
              <TouchableOpacity
                activeOpacity={1}
                style={[styles.color_chip, styles.color_chip_mid, colorChip2Style]}
                onPress={() => onColorchipTouchEvent(2)}
              />
              <TouchableOpacity
                activeOpacity={1}
                style={[styles.color_chip, colorChip3Style]}
                onPress={() => onColorchipTouchEvent(3)}
              />
            </View>
            <View style={[styles.text_tag_container]}>
              <Text style={[styles.text_tag_text]}>{textValue}</Text>
            </View>
          </ImageBackground>
        </ViewShot>
        <View style={[FlexStyles.flex_1, styles.edit_bottom]}>

          <Animated.View style={[toastFadeOpacityStyle, styles.toast_container]}>
            <Text style={[styles.toast_text]}>{toastMessageText}</Text>
          </Animated.View>

          <TouchableOpacity style={[styles.edit_bottom_button_container]} activeOpacity={0.8}>
            {/* for align space */}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.edit_bottom_button_container]} activeOpacity={1} onPress={() => showTextSettingModal()}>
            <View style={[styles.edit_bottom_button]} >
              <Image
                source={require('../../images/text.png')}
                style={[styles.edit_button_image]}
              />
            </View>
            <Text style={[styles.edit_bottom_button_text]}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.edit_bottom_button_container]} activeOpacity={1} onPress={() => shuffleColorChip()}>
            <View style={[styles.edit_bottom_button]} >
              <Image
                source={require('../../images/shuffle.png')}
                style={[styles.edit_button_image]}
              />
            </View>
            <Text style={[styles.edit_bottom_button_text]}>Shuffle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.edit_bottom_button_container]} activeOpacity={0.8}>
            {/* for align space */}
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        isVisible={textModalShow}
        // swipeDirection='up'
        style={{ justifyContent: 'flex-end', margin: 0 }}
        onSwipeComplete={() => confirmStampText()}
        swipeDirection={['up', 'down']}
        onBackdropPress={() => confirmStampText()}
      >
        <TouchableOpacity style={{ flex: 3 }} activeOpacity={0} onPress={() => confirmStampText()}>
          {/* for align space */}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.modal_container]} activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <View style={[styles.modal_option_tab]}>
            <View style={[FlexStyles.flex_4, styles.modal_option_tab_text_container]}>
              <Text style={[styles.modal_option_tab_text]} >Text</Text>
            </View>
          </View>
          <View style={FlexStyles.flex_1}>
            <View style={[styles.modal_contents_text_input_container]}>
              <View style={FlexStyles.flex_1} />
              <TextInput
                style={[FlexStyles.flex_4, styles.modal_contents_text_input]}
                onChangeText={text => setTextValue(text)}
                value={textValue}
                multiline={true}
                placeholder="사진에 들어갈 텍스트를 입력하세요"
                enablesReturnKeyAutomatically={true}
              />
              <View style={FlexStyles.flex_1} />
            </View>
            <View style={FlexStyles.flex_1, styles.modal_text_select_button_container}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={[styles.modal_text_select_button, history1DisplayStyle]} activeOpacity={0.5} onPress={() => appendTextValue(historyTextList[0])}>
                  <Text numberOfLines={1} style={[styles.modal_text_select_button_text]}>{historyTextList[0]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modal_text_select_button, history2DisplayStyle]} activeOpacity={0.5} onPress={() => appendTextValue(historyTextList[1])}>
                  <Text numberOfLines={1} style={[styles.modal_text_select_button_text]}>{historyTextList[1]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modal_text_select_button, history3DisplayStyle]} activeOpacity={0.5} onPress={() => appendTextValue(historyTextList[2])}>
                  <Text numberOfLines={1} style={[styles.modal_text_select_button_text]}>{historyTextList[2]}</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={[styles.modal_text_select_button, gpsAddress1DisplayStyle]} activeOpacity={0.5} onPress={() => appendTextValue(gpsAddressList[0])}>
                  <Text numberOfLines={1} style={[styles.modal_text_select_button_text]}>{gpsAddressList[0]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modal_text_select_button, gpsAddress2DisplayStyle]} activeOpacity={0.5} onPress={() => appendTextValue(gpsAddressList[1])}>
                  <Text numberOfLines={1} style={[styles.modal_text_select_button_text]}>{gpsAddressList[1]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modal_text_select_button, gpsAddress3DisplayStyle]} activeOpacity={0.5} onPress={() => appendTextValue(gpsAddressList[2])}>
                  <Text numberOfLines={1} style={[styles.modal_text_select_button_text]}>{gpsAddressList[2]}</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={[styles.modal_text_select_button]} activeOpacity={0.5} onPress={() => appendTextValue(getTextHHMMSS())}>
                  <Text numberOfLines={1} style={[styles.modal_text_select_button_text]}>hh:mm:ss</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modal_text_select_button]} activeOpacity={0.5} onPress={() => appendTextValue(getTextYYYYMMDD())}>
                  <Text numberOfLines={1} style={[styles.modal_text_select_button_text]}>yyyy/mm/dd</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modal_text_select_button, styles.clear_button]} activeOpacity={0.5} onPress={() => setTextValue('')}>
                  <Text numberOfLines={1} style={[styles.modal_text_select_button_text]}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[FlexStyles.flex_1, styles.modal_ok_button_container]}>
              <TouchableOpacity style={[styles.modal_ok_button]} activeOpacity={0.8} onPress={() => confirmStampText()}>
                <Text style={[styles.modal_ok_button_text]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  button_container: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  edit_button_image: {
    width: 24,
    height: 24
  },
  image_container: {
    flexDirection: 'row',
  },
  image_view: {
    flex: 1,
    position: 'relative',
    aspectRatio: 1,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'cover',
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
    borderWidth: 2
  },
  color_pick_chip_text: {
    fontSize: 25,
    lineHeight: 50,
    fontWeight: "200",
    color: "white",
    textAlignVertical: "center",
    textAlign: "center"
  },
  text_tag_container: {
    position: 'absolute',
    left: 15,
    top: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: '#FFFFFF',
    // borderStyle: 'solid'
  },
  text_tag_text: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'RobotoSlab-Regular'
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
    fontSize: 12,
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
    // fontFamily: 'RobotoSlab-Regular',
    marginTop: 15,
    fontSize: 12,
  },

  modal_container: {
    backgroundColor: 'white',
    padding: 10,
    backgroundColor: '#F5F5F6',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    height: 500,
  },
  modal_option_tab: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  modal_option_tab_button_container: {
    justifyContent: 'center',
    paddingLeft: 10,
    // alignItems: 'center',
  },
  modal_option_tab_text_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal_option_tab_text: {
    fontSize: 14,
  },
  modal_contents_text_input_container: {
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal_contents_text_input: {
    textAlign: 'center',
    fontSize: 15,
    height: 40,
    lineHeight: 20,
    textAlignVertical: 'bottom',
    alignItems: 'baseline',
    alignSelf: 'baseline',
    // maxHeight: 50,
    borderBottomColor: '#000000',
    borderStyle: 'solid',
    borderBottomWidth: 1,
  },

  modal_text_select_button_container: {
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal_text_select_button: {
    paddingTop: 8,
    paddingRight: 15,
    paddingBottom: 8,
    paddingLeft: 15,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal_text_select_button_text: {
    fontSize: 13,
    fontWeight: '400',
    maxWidth: 80,
  },
  clear_button: {
    // backgroundColor: '#d0d0d0',
  },
  modal_ok_button_container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal_ok_button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal_ok_button_text: {
    fontSize: 15,
    fontWeight: '400',
    color: '#FFFFFF',
  },
});

export default EditMain;