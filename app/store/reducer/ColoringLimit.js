import AsyncStorage from '@react-native-async-storage/async-storage';
import * as actions from '../actions/ColoringLimit';

const setColoringLimitCountToLocalStorage = async (cnt) =>
{
    try
    {
        await AsyncStorage.setItem(String(actions.COLORING_LIMIT_COUNT), String(cnt));
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
            if(state.count > 99)
            {
                state.count = 99;
            }
            setColoringLimitCountToLocalStorage(state.count);
            break;

        case actions.ERROR_ADD_COUNT:
            if(state.count < 5)
            {
                state.count = 5;
                setColoringLimitCountToLocalStorage(state.count);
            }
        default:
            // do nothing
            break;
    }

    // AsyncStorage.setItem(actions.COLORING_LIMIT_COUNT, state.count);
    return state;
}

