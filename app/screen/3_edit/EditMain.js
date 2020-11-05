import React, { useCallback, useState, useRef } from 'react';
import { StyleSheet, Text, View, Button, Image, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CameraRoll from "@react-native-community/cameraroll";
import ViewShot from 'react-native-view-shot';

import FlexStyles from '../../style/FlexStyleSheet'

// EditMain.defaultProps = {
//   imagePath : "",
// }
const EditMain = ({navigation, route}) => {

  const [preview, setPreview] = useState(null);

  const [colorchipRotate, setColorchipRotate] = useState(0);
  const [locationDisplay, setLocationDisplay] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState(false);

  const { imagePath } = route.params;

  const snapshotTarget = useRef();
  const onCapture = useCallback(() => {
    snapshotTarget.current.capture().then(uri => {
      console.log(uri);
      saveImage(uri);
    });
  }, []);

  const saveImage = async(imgUri) =>{
    config = {type : 'photo', album : 'colorground'}
    // CameraRoll.save(imgUri, config);
    const result = await CameraRoll.save(imgUri);
    console.log('🐤result', result);
    Alert.alert("사진이 갤러리에 저장되었습니다.");
  }

    return (
        <SafeAreaView style={[FlexStyles.flex_1]} >
          <View style={[FlexStyles.flex_4]}>
            <View style={[styles.option_tap]}>

            </View>

            <ViewShot ref={snapshotTarget} style={[styles.image_container]}>
              <ImageBackground style={[styles.image_view]} source={{uri: imagePath }} >
                <View style={[styles.color_chip_box]}>
                  <View style={[styles.color_chip]}></View>
                  <View style={[styles.color_chip]}></View>
                  <View style={[styles.color_chip]}></View>
                </View>
              </ImageBackground>
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
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  image_view: {
    flex: 1,
    aspectRatio: 1
  },
  color_chip: {
    width: 44,
    height: 44,
    borderRadius: 44/2,
    backgroundColor: 'red'
  }
});

export default EditMain;