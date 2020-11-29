import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';

import CameraMain from './CameraMain';
import RewardMain from './RewardMain';

const Stack = createStackNavigator();

function CameraMainNavigator()
{

    return (
        <Stack.Navigator headerMode="none"  mode="modal">
            <Stack.Screen
                name="CameraMain"
                component={CameraMain}
                options={{
                    animationEnabled: false,
                    gestureEnabled: false
                }} />

            <Stack.Screen
                name="RewardMain"
                component={RewardMain}
                options={{
                    animationEnabled: true,
                    gestureEnabled: false
                }} />
        </Stack.Navigator>
    );
}

export default CameraMainNavigator;