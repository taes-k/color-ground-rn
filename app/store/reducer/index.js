import { combineReducers } from 'redux';
import AppReady from './AppReady';
import InitialExtractColors from './InitialExtractColors'

export default combineReducers({
    appReady: AppReady,
    initialExtractColors: InitialExtractColors,
});
