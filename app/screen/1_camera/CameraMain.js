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

  const takePhoto = async () =>
  {
    if (checkColoringLimitCount())
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
    }
    else
    {
      goToRewardAd();
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
          <TouchableOpacity activeOpacity={0.8} onPress={() => { }}>
            <Image
              source={require('../../images/flash.png')}
              style={[styles.camera_button_image]}
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={() => { }}>
            <Image
              source={require('../../images/timer.png')}
              style={[styles.camera_button_image]}
            />
          </TouchableOpacity>
          <Text>{coloringLimitCount}</Text>
        </View>
        <View style={[styles.camera_container]}>
          <RNCamera
            ref={cameraRef}
            style={[FlexStyles.flex_1, styles.camera]}
            captureAudio={false} />
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
        </View>
        <View style={[FlexStyles.flex_2, styles.camera_bottom]}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => {goToAlbum()}}>
            <Image
              source={require('../../images/album.png')}
              style={[styles.camera_button_image]}
            />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.take_picture_button_outter]} activeOpacity={0.8} onPress={() => {takePhoto()}}>
            <View style={[styles.take_picture_button_inner]} ></View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => { }}>
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
    borderWidth:3,
    borderColor: '#BDC3C6',
    alignItems: 'center',
    justifyContent: 'center',

  },
  take_picture_button_inner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth:2,
    borderColor: '#FFFFFF',
    backgroundColor: '#BDC3C6',

  },
});

export default CameraMain;