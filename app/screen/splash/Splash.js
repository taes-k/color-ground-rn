import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useDispatch, useCallback } from 'react-redux';
import * as AppReadyActions from '../../store/actions/AppReady';


function Splash() {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(AppReadyActions.readyComplete());
    }, 1500);
  }, []);

  return (
    <View style={styles.view}>
      <Image source={require('../../images/app_icon.png')} style={[styles.image]}/>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width:90,
    height:90,
  }
});

export default Splash;