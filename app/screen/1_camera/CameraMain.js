import React, { useState, useEffect } from 'react';
import { AsyncStorage, StyleSheet, View, Button, TouchableHighlight, Animated, Alert, TouchableOpacity, Image, } from 'react-native';
import Text from '../../components/CustomText';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RNCamera } from 'react-native-camera';
import CameraRoll from "@react-native-community/cameraroll";
import { useFocusEffect } from '@react-navigation/native';

import * as ColoringLimitActions from '../../store/actions/ColoringLimit';
import imagePicker from 'react-native-image-picker'
import FlexStyles from '../../style/FlexStyleSheet'
import ImagePreprocessor from '../3_edit/function/ImagePreprocessor'
const CameraMain = ({ navigation, route }) =>
{
  const [cameraSize, setCameraSize] = useState(1);
  const cameraRef = React.useRef(null);
  const [cameraFlash, setCameraFlash] = useState(RNCamera.Constants.FlashMode.off);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const [cameraTimer, setCameraTimer] = useState(0);
  const [timerCount, setTimerCount] = useState(0);
  const [runTakePhotoTimer, setRunTakePhotoTimer] = useState(false);

  // ---------------------------------------------------------------------------------------------
  // camera function
  // ---------------------------------------------------------------------------------------------
  const flashImage =
    cameraFlash == RNCamera.Constants.FlashMode.off
      ? require('../../images/flash_off.png')
      : require('../../images/flash_on.png');

  const changeFlashOnOff = () =>
  {
    if (cameraFlash == RNCamera.Constants.FlashMode.off)
    {
      setCameraFlash(RNCamera.Constants.FlashMode.on);
    }
    else 
    {
      setCameraFlash(RNCamera.Constants.FlashMode.off);
    }
  }

  const resetFlash = () =>
  {
    setCameraFlash(RNCamera.Constants.FlashMode.off);
  }

  const changCameraType = () =>
  {
    if (cameraType == RNCamera.Constants.Type.back)
    {
      setCameraType(RNCamera.Constants.Type.front);
    }
    else 
    {
      setCameraType(RNCamera.Constants.Type.back);
    }
  }

  const resetCameraType = () =>
  {
    setCameraType(RNCamera.Constants.Type.front);
  }

  useEffect(() =>
  {
    setTimerCount(cameraTimer);
  }, [cameraTimer]);

  const changCameraTimer = () =>
  {
    switch (cameraTimer)
    {
      case 0:
        setCameraTimer(3);
        break;
      case 3:
        setCameraTimer(5);
        break;
      case 5:
      default:
        setCameraTimer(0);
        break;
    }
  }

  const timerImage =
    cameraTimer == 3
      ? require('../../images/timer_3.png')
      : cameraTimer == 5 ? require('../../images/timer_5.png')
        : require('../../images/timer.png');
  // ---------------------------------------------------------------------------------------------
  // TakePhoto Timer
  // ---------------------------------------------------------------------------------------------
  useEffect(() =>
  {
    if (runTakePhotoTimer)
    {
      if (timerCount > 0)
      {
        sleep(1000).then(() =>
        {
          if (timerCount > 0)
          {
            setTimerCount(timerCount - 1);
          }
        })
      }
      else
      {
        resetZeroTimer();
        resetFlash();
        takePhoto();
      }
    }
    else
    {
      setTimerCount(cameraTimer);
    }
  }, [runTakePhotoTimer, timerCount]);

  const resetTimer = () =>
  {
    setRunTakePhotoTimer(false);
    setCameraTimer(cameraTimer);
  }

  const resetZeroTimer = () =>
  {
    setRunTakePhotoTimer(false);
    setCameraTimer(0);
  }

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const startTakePhotoTimer = async () => 
  {
    setRunTakePhotoTimer(true);
  }

  const stopTakePhoto = () =>
  {
    resetTimer();
  }

  const timerCounterStyle = { display: timerCount > 0 ? 'flex' : 'none' }

  const stopTimerButtonStyle = { display: runTakePhotoTimer ? 'flex' : 'none' }


  // ---------------------------------------------------------------------------------------------
  // coloring limit
  // ---------------------------------------------------------------------------------------------
  const COUNT_WARNING_MESSAGE = "광고시청후 사용가능 횟수를 충전 할 수 있습니다";
  const COUNT_ZERO_MESSAGE = "광고시청후 사용가능 횟수를 충전 할 수 있습니다";

  const dispatch = useDispatch();
  const coloringLimitCount = useSelector((state) => state.coloringLimit.count);
  const [rewardCountWarning, setRewardCountWarning] = useState(false);

  useEffect(() =>
  {
    rewardWarningCheck();
  }, [coloringLimitCount])

  const rewardWarningCheck = () =>
  {
    if (coloringLimitCount < 4)
    {
      if(coloringLimitCount == 0)
      {
        setToastMessageText(COUNT_ZERO_MESSAGE);
      }
      else
      {
        setToastMessageText(COUNT_WARNING_MESSAGE);
      }
  
      setRewardCountWarning(true);
    }
    else 
    { 
      setRewardCountWarning(false);
    }
  }
  const goToRewardAd = () =>
  {
    navigation.navigate('RewardMain', {});
  }

  const checkColoringLimitCount = () =>
  {
    if (coloringLimitCount <= 0)
    {
      return false;
    }
    return true;
  }

  const useColoringLimitCount = () =>
  {
    dispatch(ColoringLimitActions.useCount());
  }

  const rewardCountWarningStyle = { color: rewardCountWarning ? '#FF4343' : '#000000' };

  // ---------------------------------------------------------------------------------------------
  // toast
  // ---------------------------------------------------------------------------------------------
  const [toastMessageText, setToastMessageText] = useState(COUNT_WARNING_MESSAGE);
  const [toastBlink, setToastBlink] = useState(false);
  const [toastOpacityAnimatedValue, setToastOpacityAnimatedValue] = useState(new Animated.Value(0));

  useFocusEffect(
    React.useCallback(() =>
    {
      if(rewardCountWarning)
      {
        setToastBlink(true);
      }
      else
      {
        setToastOpacityAnimatedValue(new Animated.Value(0));
      }

      return () => setToastBlink(false);
    }, [rewardCountWarning])
  );

  useEffect(()=>{
    var timeout;

    if(toastBlink == true)
    {
      fadeInToast();
      timeout = setTimeout(() => {
        fadeOutToast();
      }, 2000);
    }

    return () => clearTimeout(timeout);
  },[toastBlink])

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
  // take photo
  // ---------------------------------------------------------------------------------------------
  
  const onPressTakePhoto = () =>
  {
    if (runTakePhotoTimer)
    {
      stopTakePhoto();
    }
    else
    {
      checkAndTakePhoto();
    }
  }

  const checkAndTakePhoto = () => 
  {
    if (checkColoringLimitCount())
    {
      if (cameraTimer == 0)
      {
        takePhoto();
      }
      else
      {
        startTakePhotoTimer();
      }
    }
    else
    {
      goToRewardAd();
    }
  }

  const takePhoto = async () =>
  {
    if (cameraRef)
    {
      const data = await cameraRef.current.takePictureAsync({
        quality: 1,
        exif: true,
        fixOrientation: true,
        orientation: "portrait",
      });

      console.log('cameralog:', data);

      ImagePreprocessor.getResizeImage(data.uri).then(
        res =>
        {
          useColoringLimitCount();
          navigation.navigate('Edit', { imageData: res })
        }
      );
    }
  };

  // ---------------------------------------------------------------------------------------------
  // go to album
  // ---------------------------------------------------------------------------------------------

  const [albumImageSource, setAlbumImageSource] = useState(require('../../images/album.png'));

  useFocusEffect(
    React.useCallback(() =>
    {
      getRecentPhoto().then(res =>
      {
        console.log("album RES", res);

        if(res.edges.length > 0)
        {
          var sourceUri = {
            uri: res.edges[0].node.image.uri,
          }

          setAlbumImageSource(sourceUri);
        }
      })
    }, []));

  const getRecentPhoto = async () =>
  {
    return CameraRoll.getPhotos({
      first: 1,
      assetType: 'Photos'
    });
  }

  const goToAlbum = () =>
  {

    if (checkColoringLimitCount())
    {
      const options = { noData: true };

      imagePicker.launchImageLibrary(options, response =>
      {
        if (response != null && response.uri != null)
        {
          ImagePreprocessor.getResizeImage(response.uri).then(
            res =>
            {
              useColoringLimitCount();
              navigation.navigate('Edit', { imageData: res })
            }
          );
        }
      })
    }
    else
    {
      goToRewardAd();
    }
  };


  return (
    <SafeAreaView style={[FlexStyles.flex_1, styles.background_style]} >
      <View style={[FlexStyles.flex_1]}>
        <View style={[styles.option_tap]}>
          <TouchableOpacity style={[styles.button_container]} activeOpacity={1} onPress={() => { changeFlashOnOff() }}>
            <Image
              source={flashImage}
              style={[styles.camera_button_image]}
            />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button_container]} activeOpacity={1} onPress={() => { changCameraTimer() }}>
            <Image
              source={timerImage}
              style={[styles.camera_button_image]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button_container, styles.reward_counter_text_container]} activeOpacity={1} onPress={() => { goToRewardAd() }}>
            <Text style={[rewardCountWarningStyle, styles.reward_counter_text]}>{coloringLimitCount}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.camera_container]}>
          <RNCamera
            ref={cameraRef}
            type={cameraType}
            flashMode={cameraFlash}
            captureAudio={false}
            ratio="1:1"
            style={[FlexStyles.flex_1, styles.camera]} />
          <View style={[styles.color_chip_box]}>
            <View style={[styles.color_chip]} />
            <View style={[styles.color_chip, styles.color_chip_mid]} />
            <View style={[styles.color_chip]} />
          </View>
          <View style={[styles.timer_counter_container]}>
            <Text style={[timerCounterStyle, styles.timer_counter]}>{timerCount}</Text>
          </View>
        </View>
        <View style={[FlexStyles.flex_2, styles.camera_bottom]}>
          <Animated.View style={[toastFadeOpacityStyle, styles.toast_container]}>
            <Text style={[styles.toast_text]}>{toastMessageText}</Text>
          </Animated.View>

          <TouchableOpacity activeOpacity={1} onPress={() => { goToAlbum() }}>
            <Image
              source={albumImageSource}
              style={[styles.album_button_image]}
            />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.take_picture_button_outter]} activeOpacity={1} onPress={onPressTakePhoto}>
            <View style={[styles.take_picture_button_inner]} >
              <Image
                source={require('../../images/cancel_white.png')}
                style={[stopTimerButtonStyle, styles.camera_button_image]}
              />
              {/* <Text style={[stopTimerButtonStyle, styles.stop_take_picture_text]}>X</Text> */}
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={1} onPress={() => { changCameraType() }}>
            <Image
              source={require('../../images/rotate.png')}
              style={[styles.camera_rotate_image]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background_style: {
    backgroundColor: '#F5F5F6',
  },

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
  reaward_counter_text_container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reaward_counter_text: {
    width: 24,
    height: 24,
    lineHeight: 24,
    fontSize: 14,
    textAlign: 'center',
  },
  reward_tooltip_text: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  camera_container: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    // flex: 1,
    width:'100%',
    aspectRatio: 1,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  color_chip_box: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 44 / 2,
  },
  color_chip: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    borderColor: '#FFFFFF',
    borderStyle: 'dotted',
    borderWidth: 1,
  },
  color_chip_mid: {
    marginLeft: 15,
    marginRight: 15,
  },
  timer_counter_container: {
    position: 'absolute',
    bottom: 10
  },
  timer_counter: {
    color: '#FFFFFF',
    fontSize: 45,
    fontWeight: '300',
  },
  camera_bottom: {
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
  album_button_image: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  camera_button_image: {
    width: 24,
    height: 24,
  },
  camera_rotate_image: {
    width: 32,
    height: 32,
  },
  take_picture_button_outter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',

  },
  take_picture_button_inner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',

  },
  stop_take_picture_text: {
    fontSize: 25,
    fontWeight: '200',
    color: '#FFFFFF',
  }
});

export default CameraMain;