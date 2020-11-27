import AsyncStorage from '@react-native-async-storage/async-storage';
import * as actions from '../actions/ColoringLimit';

const setColoringLimitCountToLocalStorage = async (cnt) =>
{
    try
    {
        await AsyncStorage.setItem(String(actions.COLORING_LIMIT_COUNT), String(cnt));
        var getCount = await AsyncStorage.getItem(String(actions.COLORING_LIMIT_COUNT));
        console.log("LOCAL COUNT ::: ", getCount)
    } catch (e)
    {
        console.log("set ColoringLimitCount local storage error");
        // saving error
    }
}

const initialState = {
    count: 10,
}

export default (state = initialState, action) =>
{
    switch (action.type)
    {
        case actions.SET_COUNT:
            state.count = action.count;
            setColoringLimitCountToLocalStorage(state.count);
            break;

        case actions.USE_COUNT:
            state.count = state.count - 1;
            setColoringLimitCountToLocalStorage(state.count);
            break;

        case actions.ADD_COUNT:
            state.count = state.count + action.count;
            setColoringLimitCountToLocalStorage(state.count);
            break;
        default:
            // do nothing
            break;
    }

    // AsyncStorage.setItem(actions.COLORING_LIMIT_COUNT, state.count);
    return state;
}

