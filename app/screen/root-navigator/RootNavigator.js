import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';

import Splash from '../splash/Splash';
import CameraMain from '../1_camera/CameraMain';
import AppMainStack from './AppMainStack';
import * as ColoringLimitActions from '../../store/actions/ColoringLimit';

const RootStack = createStackNavigator();

function RootNavigator()
{
    const dispatch = useDispatch();

    const isReady = useSelector((state) => state.appReady.isReady);
    // const coloringLimitCount = 

    useEffect(() =>
    {
        console.log("count setting");
        getColoringLimitCount()
            .then(res => dispatch(ColoringLimitActions.setCount(res)));
    }, []);

    getColoringLimitCount = async () =>
    {
        var count = 10;
        try
        {
            count = await AsyncStorage.getItem(String(ColoringLimitActions.COLORING_LIMIT_COUNT));

            if (count != null)
            {
                // local string to integer
                count *= 1;
                console.log("get local coloringlimitcount data : ", count);
            }
            else
            {
                console.log("there's no local coloringlimitcount data");
                count = 10;
            }
        }
        catch (err)
        {
            console.log(err);
        }
        return count;
    }

    return (
        <NavigationContainer>
            <RootStack.Navigator
                headerMode="none"
                screenOptions={{ animationEnabled: false }}
            // mode="modal"
            >
                {isReady
                    ? <RootStack.Screen name="AppMainStack" component={AppMainStack} />
                    : <RootStack.Screen name="Splash" component={Splash} />
                }
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

export default RootNavigator;