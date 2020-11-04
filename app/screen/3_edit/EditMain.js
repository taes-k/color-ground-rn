import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FlexStyles from '../../style/FlexStyleSheet'

// EditMain.defaultProps = {
//   imagePath : "",
// }
const EditMain = ({navigation, route}) => {

  console.log('props', route.params);
  const { imagePath } = route.params;
    return (
        <SafeAreaView style={[FlexStyles.flex_1]} >
          <View style={[FlexStyles.flex_4]}>
          <Image style={[styles.image_view]} source={{uri: imagePath }} />
          </View>
          <View style={[FlexStyles.flex_2]}>
            <Button title="Go back" onPress={() => navigation.goBack()} />
          </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({ 
  image_view: {
    flex: 1,
  },
});

export default EditMain;