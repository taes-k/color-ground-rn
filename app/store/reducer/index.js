import { combineReducers } from 'redux';
import AppReady from './AppReady';
import ColoringLimit from './ColoringLimit';

export default combineReducers({
    appReady: AppReady,
    coloringLimit: ColoringLimit,
});
