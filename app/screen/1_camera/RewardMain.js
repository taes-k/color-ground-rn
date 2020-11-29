import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView, withSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RewardedAd, RewardedAdEventType, AdEventType, TestIds } from '@react-native-firebase/admob';

import * as ColoringLimitActions from '../../store/actions/ColoringLimit';
import FlexStyles from '../../style/FlexStyleSheet'

const RewardMain = ({ navigation, route }) =>
{
    const dispatch = useDispatch();
    const coloringLimitCount = useSelector((state) => state.coloringLimit.count);

    // ---------------------------------------------------------------------------------------------
    // google admob reward advertise
    // ---------------------------------------------------------------------------------------------

    const adUnitId = __DEV__ ? 'ca-app-pub-8392395015115496~7322378671' : 'ca-app-pub-8392395015115496~7322378671';
    // const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-3940256099942544/1712485313';

    const rewarded = RewardedAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
        keywords: ['fashion', 'clothing'],
    });

    useEffect(() =>
    {
        return () => eventListener()
    }, []);


    const eventListener = rewarded.onAdEvent((type, error, reward) =>
    {
        if(type != AdEventType.ERROR)
        {
            if (type === RewardedAdEventType.LOADED)
            {
                // ready to show ad
                rewarded.show();
            }

            if (type === RewardedAdEventType.EARNED_REWARD)
            {
                // get reward
                dispatch(ColoringLimitActions.addCount(3));
            }

            if (type === AdEventType.CLOSED)
            {
                // ad closed
            }
        }
        else
        {
            alert("광고 서비스 오류로 인해 정상수행되지 않습니다. 에너지는 바로 채울게요!");
            dispatch(ColoringLimitActions.addErrorCount(3));
        }
    });

    const showAd = () =>
    {
        rewarded.load();
    }

    return (

        <SafeAreaView style={[FlexStyles.flex_1, styles.background_style]} >
            <View style={[FlexStyles.flex_1]}>
                <View style={[styles.option_tap]}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
                        <Image
                            source={require('../../images/cancel.png')}
                            style={[styles.option_tap_image]}
                        />
                    </TouchableOpacity>
                    <View>
                        <Image
                            source={require('../../images/white_square.png')}
                            style={[styles.option_tap_image]}
                        />
                    </View>
                    <Text>{coloringLimitCount}</Text>
                </View>
                <View style={[styles.reward_container]}>
                    <TouchableOpacity style={[FlexStyles.flex_1, styles.reward]} activeOpacity={0.8} onPress={() => showAd()}>
                        <View style={{ width: 84, height: 84, borderTopColor: 'rgba(0,0,0,0)', borderRightColor: 'rgba(0,0,0,1)', borderBottomColor: 'rgba(0,0,0,0)', borderLeftColor: '#aaaaaa', borderStyle: 'solid', borderTopWidth: 43, borderRightwidth: 0, borderBottomWidth: 43, borderLeftWidth: 84 }}>
                            <Text>Aa</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[FlexStyles.flex_2, styles.reward_bottom]}>
                    <Text style={[styles.reward_text]}> 광고 한편 보고 와 주시면{"\n"} 저는 색상 추출을 위한 에너지를 모으고 있을게요.</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background_style: {
        backgroundColor: '#FFFFFF',
    },

    option_tap: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    option_tap_image: {
        width: 30,
        height: 30,
    },
    reward_container: {
        flexDirection: 'row',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    reward: {
        flex: 1,
        aspectRatio: 1,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'yellow',
    },
    reward_bottom: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    reward_text: {
        fontSize: 16,
    },
});


export default RewardMain;
