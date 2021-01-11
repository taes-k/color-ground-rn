import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';

import Splash from '../splash/Splash';
import CameraMain from '../1_camera/CameraMain';
import AppMainStack from './AppMainStack';
import * as ColoringLimitActions from '../../store/actions/ColoringLimit';
import * as TutorialStatusActions from '../../store/actions/TutorialStatus';
import * as TextHistoryActions from '../../store/actions/TextHistory';

const RootStack = createStackNavigator();

function RootNavigator()
{
    const dispatch = useDispatch();
    const isReady = useSelector((state) => state.appReady.isReady);

    useEffect(() =>
    {
        console.log("count setting");
        getColoringLimitCount()
            .then(res => dispatch(ColoringLimitActions.setCount(res)));

        console.log("tutorial setting");
        getTutorialStatus()
            .then(res => dispatch(TutorialStatusActions.setTutorialStatus(res)));

        console.log("textHistory setting");
        getTextHistory()
            .then(res => dispatch(TextHistoryActions.setTextHistory(res)));
    }, []);

    getColoringLimitCount = async () =>
    {
        const STANDARD_COUNT = 10;
        var count = STANDARD_COUNT;
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
                count = STANDARD_COUNT;
            }
        }
        catch (err)
        {
            count = STANDARD_COUNT;
            console.log(err);
        }
        return count;
    }

    getTextHistory = async () =>
    {
        const STANDARD_LIST = [];
        var list = STANDARD_LIST;
        try
        {
            var tsvList = await AsyncStorage.getItem(String(TextHistoryActions.TEXT_HISTORY));

            if (tsvList != null)
            {
                list = tsvList.split("\t");
            }
            else
            {
                console.log("there's no local textHistory data");
                list = STANDARD_LIST;
            }
        }
        catch (err)
        {
            list = STANDARD_LIST;
            console.log(err);
        }
        return list;
    }

    getTutorialStatus = async () =>
    {
        var status = false;
        try
        {
            status = await AsyncStorage.getItem(String(TutorialStatusActions.TUTORIAL_SUCCESS_STATUS));

            if (status === 'true')
            {
                // local string to integer
                status = true;
                console.log("get local status data : ", status);
            }
            else
            {
                status = false;
                console.log("there's no local status");
            }
        }
        catch (err)
        {
            status = false;
            console.log(err);
        }
        return status;
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