import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
      <Text style={styles.text}>
        Splash Screen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 24,
    backgroundColor: "#eaeaea"
  },
  text: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "#61dafb",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold"
  }
});

export default Splash;