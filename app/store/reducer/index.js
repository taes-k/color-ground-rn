import { combineReducers } from 'redux';
import AppReady from './AppReady';
import ColoringLimit from './ColoringLimit';
import TutorialStatus from './TutorialStatus';

export default combineReducers({
    appReady: AppReady,
    coloringLimit: ColoringLimit,
    tutorialStatus: TutorialStatus,
});
