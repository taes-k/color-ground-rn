import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableHighlight, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RNCamera } from 'react-native-camera';

import FlexStyles from '../../style/FlexStyleSheet'

const CameraMain = () => {
    const [cameraSize, setCameraSize] = useState(1);
    const cameraRef = React.useRef(null);

    const takePhoto = async () => {
      console.log('cameraRef', cameraRef);
      if (cameraRef) {
        const data = await cameraRef.current.takePictureAsync({
            quality: 1,
            exif: true,
        });
        console.log('capture', data);
      }
    };

    const changeCameraSize = () => {
      if(cameraSize == 1)
        setCameraSize(3/4);
      else
        setCameraSize(1);
    }

    var cameraStyle;
    if(cameraSize == 1)
      cameraStyle = [styles.camera_ratio_square];
    else if (cameraSize == 3/4)
      cameraStyle = [styles.camera_ratio_rectangle];

    return (
        <SafeAreaView style={[FlexStyles.flex_1]} >
            <View style={[styles.camera_container]}>
                <View style={[FlexStyles.flex_1, cameraStyle]}>
                  <RNCamera
                  ref={cameraRef}
                  style={[FlexStyles.flex_1]}
                  captureAudio={false} />
                </View>
            </View>
            <View style={[styles.camera_bottom]}>
              <Button onPress={takePhoto} title='A'/>
              <Button onPress={changeCameraSize} title='B'/>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({ 
  camera_container: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  camera_bottom: {
    flex: 1,
    backgroundColor: 'white'
  },
  camera_ratio_square: {
    flex:1,
    aspectRatio: 1
  },
  camera_ratio_rectangle: {
    flex:1,
    aspectRatio: 3/4
  },
});

export default CameraMain;