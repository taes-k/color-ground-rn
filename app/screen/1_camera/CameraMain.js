import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FlexStyles from '../../style/FlexStyleSheet'

const CameraMain = () => {

    return (
        <SafeAreaView style={[FlexStyles.flex_1]} >
            <Text>Camera</Text>
        </SafeAreaView>
    );
}

export default CameraMain;