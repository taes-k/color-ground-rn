import AsyncStorage from '@react-native-async-storage/async-storage';
import * as actions from '../actions/TextHistory';

const setTextHistoryToLocalStorage = async (list) =>
{
    try
    {
        var tsv = "";
        list.forEach(element =>
        {
            tsv += element + "\t";
        });
        await AsyncStorage.setItem(String(actions.TEXT_HISTORY), String(tsv));

    } catch (e)
    {
        console.log("set TextHistory local storage error");
        // saving error
    }
}

const initialState = {
    list: [],
}

export default (state = initialState, action) =>
{
    switch (action.type)
    {
        case actions.SET_NEW_TEXT:
            state.count = action.text;
            var list = state.list;
            var checkedIndex = list.indexOf(action.text);

            if (checkedIndex < 0)
            {
                list.unshift(action.text);
            }
            else
            {
                list.splice(checkedIndex, 1);
                list.unshift(action.text);
            }

            if (list.length > 3)
            {
                list.splice(3);
            }

            console.log("history list : ", state.list);
            state.list = list;
            setTextHistoryToLocalStorage(state.list);
            break;

        case actions.SET_TEXT_HISTORY:
            state.list = action.list;
            break;
        default:
            // do nothing
            break;
    }

    // AsyncStorage.setItem(actions.COLORING_LIMIT_COUNT, state.count);
    return state;
}

