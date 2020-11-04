import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';

import Camera from '../1_camera/CameraMain';
import Edit from '../3_edit/EditMain';

const Stack = createStackNavigator();

function AppMainStack() {

    return (
        <Stack.Navigator
            headerMode="none">

            <Stack.Screen
                name="Camera"
                component={Camera}
                options={{  }} />
            
            <Stack.Screen 
                name="Edit" 
                component={Edit}  />
        </Stack.Navigator>
    );
}

export default AppMainStack;