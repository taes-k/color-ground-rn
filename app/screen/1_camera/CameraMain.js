import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableHighlight, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RNCamera } from 'react-native-camera';

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
  // change camera size
  // ---------------------------------------------------------------------------------------------
  const changeCameraSize = () =>
  {
    if (cameraSize == 1)
      setCameraSize(3 / 4);
    else
      setCameraSize(1);
  }

  var cameraStyle;
  if (cameraSize == 1)
    cameraStyle = [styles.camera_ratio_square];
  else if (cameraSize == 3 / 4)
    cameraStyle = [styles.camera_ratio_rectangle];

  // ---------------------------------------------------------------------------------------------
  // go to album
  // ---------------------------------------------------------------------------------------------
  const goToAlbum = () =>
  {
    navigation.navigate('Album', {});
  };

  return (
    <SafeAreaView style={[FlexStyles.flex_1]} >
      <View style={[FlexStyles.flex_4, styles.camera_container]}>
        <View style={[FlexStyles.flex_1, cameraStyle]}>
          <RNCamera
            ref={cameraRef}
            style={[FlexStyles.flex_1]}
            captureAudio={false} />
        </View>
      </View>
      <View style={[FlexStyles.flex_2, styles.camera_bottom]}>
        <Button onPress={takePhoto} title='TakePhoto' />
        <Button onPress={changeCameraSize} title='B' />
        <Button onPress={goToAlbum} title='Album' />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  camera_container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  camera_bottom: {
    backgroundColor: 'white'
  },
  camera_ratio_square: {
    aspectRatio: 1
  },
  camera_ratio_rectangle: {
    aspectRatio: 3 / 4
  },
});

export default CameraMain;