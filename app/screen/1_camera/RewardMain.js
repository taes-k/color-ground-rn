import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import Text from '../../components/CustomText';
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

    const [adLoading, setAdLoading] = useState(false);
    const adUnitId = __DEV__
        ? TestIds.REWARDED
        // 'ca-app-pub-8392395015115496/6109911925'
        : Platform.OS === 'ios' ? 'ca-app-pub-8392395015115496/6109911925' : 'ca-app-pub-8392395015115496/7719588637';

    const rewarded = RewardedAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
        // keywords: ['fashion', 'clothing'],
    });

    useEffect(() =>
    {
        return () => eventListener()
    }, []);


    const eventListener = rewarded.onAdEvent((type, error, reward) =>
    {
        if (type != AdEventType.ERROR)
        {
            if (type === RewardedAdEventType.LOADED)
            {
                // ready to show ad
                rewarded.show();
                setAdLoading(false);
            }

            if (type === RewardedAdEventType.EARNED_REWARD)
            {
                // get reward
                dispatch(ColoringLimitActions.addCount(5));
            }

            if (type === AdEventType.CLOSED)
            {
                // ad closed
            }
        }
        else
        {
            console.log("Error", error);
            setAdLoading(false);
            dispatch(ColoringLimitActions.addErrorCount(5));
            alert("아직 광고 준비중이예요. 5회까지 자유롭게 이용하세요!");
        }
    });

    const showAd = () =>
    {
        if (adLoading != true)
        {
            setAdLoading(true);
            rewarded.load();
        }
    }

    const adLoadingButtonStyle = { disabled: adLoading, backgroundColor: !adLoading ? '#000000' : '#afafaf' };
    const adLoadingTextStyle = { display: adLoading ? 'none' : 'flex' };
    const adLoadingIndicatorStyle = { display: !adLoading ? 'none' : 'flex' };

    return (

        <SafeAreaView style={[FlexStyles.flex_1, styles.background_style]}>
            <View style={[FlexStyles.flex_1]}>
                <View style={[styles.option_tap]}>
                    <View style={[FlexStyles.flex_3, styles.button_back_container]}>
                        <TouchableOpacity style={[styles.button_container, styles.button_back]} activeOpacity={0.8} onPress={() => navigation.goBack()}>
                            <Image
                                source={require('../../images/cancel.png')}
                                style={[styles.option_tap_image]}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={[FlexStyles.flex_3, styles.button_container, styles.reaward_counter_text_container]}>
                        <Text style={[styles.reaward_counter_text]}>현재 {coloringLimitCount}회 남음</Text>
                    </View>
                </View>
                <View style={[FlexStyles.flex_column_4, styles.reward_text_container]}>
                    <Text style={[styles.reward_text_title]}>
                        3XO
                    </Text>
                    <Text style={[styles.reward_text]}>
                        내가 기억하는 곳, 내가 기억하는 시간,{"\n"}
                        나를 둘러싸고 있는 지금,{"\n"}
                        익숙한 장소 혹은 낯선 여행지에서,{"\n"}
                        {"\n"}
                        당신의 공간은 어떤색인가요 ?{"\n"}
                        {"\n"}
                        아래 버튼을 눌러 광고를 시청해 주시면 {"\n"}
                        사용횟수를 추가 할 수 있습니다.{"\n"}
                        {"\n"}
                        계속해서 더 좋은 서비스가 될 수 있도록{"\n"}
                        노력하겠습니다. 감사합니다.{"\n"}

                    </Text>
                </View>
                <View style={[FlexStyles.flex_1, styles.reward_button_container]}>
                    <TouchableOpacity style={[FlexStyles.flex_1, styles.reward_button, adLoadingButtonStyle]} activeOpacity={1} onPress={() => showAd()}>
                        <Text style={[styles.reward_button_text, adLoadingTextStyle]}>광고보고 5회 추가하기</Text>
                        <ActivityIndicator style={[adLoadingIndicatorStyle]} size="large" color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background_style: {
        backgroundColor: '#F5F5F6',
    },

    option_tap: {
        paddingLeft: 19,
        paddingRight: 19,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',

    },
    button_container: {
        padding: 5,
        alignItems: 'center',
        // justifyContent: 'center',
    },
    button_back_container: {
        justifyContent: 'flex-start',
    },
    button_back: {
        alignSelf: 'flex-start',
    },
    reaward_counter_text_container: {
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    reaward_counter_text: {
        textAlign: 'center',
        textAlignVertical: 'center',
        alignSelf: 'flex-end',
        fontSize: 14,
        height: 24,
        lineHeight: 24,
    },

    option_tap_image: {
        width: 24,
        height: 24,
    },
    reward_text_container: {
        paddingTop: 30,
        paddingRight: 24,
        paddingBottom: 30,
        paddingLeft: 24,
        // flexDirection: 'row',
        // justifyContent: 'space-around',
        alignItems: 'flex-start',
    },
    reward_text_title: {
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 40,
    },
    reward_text: {
        fontSize: 16,
        lineHeight: 25,
    },
    reward_button_container: {
        flexDirection: 'row',
        position: 'relative',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    reward_button: {
        flex: 1,
        height: 70,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
    },
    reward_button_text: {
        color: '#FFFFFF',
        fontSize: 16,
        lineHeight: 70,
    },
});


export default RewardMain;
