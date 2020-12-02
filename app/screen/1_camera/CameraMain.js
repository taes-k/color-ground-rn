import React, { useState, useEffect } from 'react';
import { AsyncStorage, StyleSheet, Text, View, Button, TouchableHighlight, Animated, Alert, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RNCamera } from 'react-native-camera';

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
  const [runTakePhoto, setRunTakePhoto] = useState(false);

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

  const resetFlash= () =>
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

  const resetCameraType= () =>
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
    if (runTakePhoto)
    {
      if (timerCount > 0)
      {
        sleep(1000).then(()=>{
          if (timerCount > 0)
          {
            setTimerCount(timerCount - 1);
          }
        })
      }
      else
      {
        resetTimer();
        resetFlash();
        takePhoto();
      }
    }
    else
    {
      setTimerCount(cameraTimer);
    }
  }, [runTakePhoto, timerCount]);

  const resetTimer = () => {
    setRunTakePhoto(false);
    setCameraTimer(0);
  }

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const startTakePhoto = async () => 
  {
    setRunTakePhoto(true);
  }

  const stopTakePhoto = () =>
  {
    resetTimer();
  }

  const timerCounterStyle = {display: timerCount>0?'flex':'none'}

  const stopTimerButtonStyle = {display: runTakePhoto?'flex':'none'}


  // ---------------------------------------------------------------------------------------------
  // coloring limit
  // ---------------------------------------------------------------------------------------------
  const dispatch = useDispatch();
  const coloringLimitCount = useSelector((state) => state.coloringLimit.count);

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

  // ---------------------------------------------------------------------------------------------
  // take photo
  // ---------------------------------------------------------------------------------------------
  const onPressTakePhoto = () =>
  {
    if(runTakePhoto)
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
      startTakePhoto();
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
      });

      ImagePreprocessor.getResizeImage(data.uri).then(
        res =>
        {
          useColoringLimitCount();
          navigation.navigate('Edit', { imagePath: res })
        }
      );
    }
  };

  // ---------------------------------------------------------------------------------------------
  // go to album
  // ---------------------------------------------------------------------------------------------
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
              navigation.navigate('Edit', { imagePath: res })
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
          <TouchableOpacity activeOpacity={0.8} onPress={() => { changeFlashOnOff() }}>
            <Image
              source={flashImage}
              style={[styles.camera_button_image]}
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={() => { changCameraTimer() }}>
            <Image
              source={timerImage}
              style={[styles.camera_button_image]}
            />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => { goToRewardAd() }}>
            <Text style={[styles.reaward_counter_text]}>{coloringLimitCount}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.camera_container]}>
          <RNCamera
            ref={cameraRef}
            type={cameraType}
            flashMode={cameraFlash}
            captureAudio={false}
            style={[FlexStyles.flex_1, styles.camera]} />
          <View style={[styles.color_chip_box]}>
            <View
              style={[styles.color_chip]}
            />
            <View
              style={[styles.color_chip]}
            />
            <View
              style={[styles.color_chip]}
            />
          </View>
          <Text style={[timerCounterStyle, styles.timer_counter]}>{timerCount}</Text>
        </View>
        <View style={[FlexStyles.flex_2, styles.camera_bottom]}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => { goToAlbum() }}>
            <Image
              source={require('../../images/album.png')}
              style={[styles.camera_button_image]}
            />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.take_picture_button_outter]} activeOpacity={0.8} onPress={onPressTakePhoto}>
            <View style={[styles.take_picture_button_inner]} >
              <Text style={[stopTimerButtonStyle, styles.stop_take_picture_text]}>X</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => { changCameraType() }}>
            <Image
              source={require('../../images/rotate.png')}
              style={[styles.camera_button_image]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background_style: {
    backgroundColor: '#FFFFFF',
  },

  option_tap: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  reaward_counter_text: {
    fontSize:17,
  },
  camera_container: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
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
    marginRight: 15,
    borderColor: '#FFFFFF',
    borderStyle: 'dotted',
    borderWidth: 1,
  },
  timer_counter: {
    color:'#FFFFFF',
    fontSize: 45, 
    fontWeight: '300',
    position:'absolute', 
    bottom: 10
  },
  camera_bottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  camera_button_image: {
    width: 30,
    height: 30,
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
  stop_take_picture_text:{
    fontSize: 25,
    fontWeight: '200',
    color: '#FFFFFF',
  }
});

export default CameraMain;