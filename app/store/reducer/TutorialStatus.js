import AsyncStorage from '@react-native-async-storage/async-storage';
import * as actions from '../actions/TutorialStatus';

const setTutorialStatusToLocalStorage = async (status) =>
{
    try
    {
        await AsyncStorage.setItem(String(actions.TUTORIAL_SUCCESS_STATUS), String(status));
    } catch (e)
    {
        console.log("setTutorialStatusToLocalStorage local storage error", e);
    }
}

const initialState = {
    editTutorial: false,
}

export default (state = initialState, action) =>
{
    switch (action.type)
    {
        case actions.SET_TUTORIAL_STATUS:
            state.editTutorial = action.status;
            setTutorialStatusToLocalStorage(action.status);
            break;
        case actions.SET_EDIT_TUTORIAL_SUCCESS:
            state.editTutorial = true;
            setTutorialStatusToLocalStorage(true);
            break;
        default:
        // do nothing
            break;
    }

    return state;
}

