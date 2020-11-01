import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';

import Splash from '../splash/Splash';
import CameraMain from '../1_camera/CameraMain';

const RootStack = createStackNavigator();

function RootNavigator() {

    const isReady = useSelector((state) => state.appReady.isReady);

    return (
        <NavigationContainer>
            <RootStack.Navigator
                headerMode="none"
                screenOptions={{ animationEnabled: false }}
                // mode="modal"
            >

                {isReady
                    ? <RootStack.Screen name="CameraMain" component={CameraMain} />
                    : <RootStack.Screen name="Splash" component={Splash} />
                }
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

export default RootNavigator;