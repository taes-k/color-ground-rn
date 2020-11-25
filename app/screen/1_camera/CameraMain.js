import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableHighlight, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RNCamera } from 'react-native-camera';
import imagePicker from 'react-native-image-picker'

import FlexStyles from '../../style/FlexStyleSheet'

import ImagePreprocessor from '../3_edit/function/ImagePreprocessor'
const CameraMain = ({ navigation, route }) =>
{
  const [cameraSize, setCameraSize] = useState(1);
  const cameraRef = React.useRef(null);

  // ---------------------------------------------------------------------------------------------
  // take photo
  // ---------------------------------------------------------------------------------------------
  const takePhoto = async () =>
  {
    console.log('cameraRef', cameraRef);
    if (cameraRef)
    {
      const data = await cameraRef.current.takePictureAsync({
        quality: 1,
        exif: true,
      });

      var resizeImageurl = await ImagePreprocessor.getResizeImage(data.uri);
      navigation.navigate('Edit', { imagePath: resizeImageurl });
    }
  };

  // ---------------------------------------------------------------------------------------------
  // go to album
  // ---------------------------------------------------------------------------------------------
  const goToAlbum = () =>
  {
    const options = { noData: true };

    imagePicker.launchImageLibrary(options, response =>
    {
      // console.log("response", response);

      if (response != null && response.uri != null)
      {
        ImagePreprocessor.getResizeImage(response.uri).then(
          res => navigation.navigate('Edit', { imagePath: res })
        );
      }
    })
  };

  return (
    <SafeAreaView style={[FlexStyles.flex_1, styles.background_style]} >
      <View style={[FlexStyles.flex_1]}>
        <View style={[styles.option_tap]}>
          <Button title='플래시' />
          <Button title='타이머' />
          <Button title='27' />
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
          <Button onPress={goToAlbum} title='Album' />
          <Button onPress={takePhoto} title='TakePhoto' />
          <Button title='rotate' />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background_style: {
    // backgroundColor: 'rgba(0,0,0,1)',
    backgroundColor: '#FFFFFF',
  },

  option_tap: {
    // backgroundColor: 'blue',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  camera_container: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    // alignItems: 'flex-start',
    // justifyContent: 'center',
    // backgroundColor: 'white'
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
    // backgroundColor: 'red',
    marginRight: 15,
    borderColor: '#FFFFFF',
    borderStyle: 'dotted',
    borderWidth: 1,
  },
  camera_bottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'white'
  },
  camera_ratio_square: {
    aspectRatio: 1
  },
  camera_ratio_rectangle: {
    aspectRatio: 3 / 4
  },
});

export default CameraMain;