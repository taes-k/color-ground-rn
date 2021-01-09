import { combineReducers } from 'redux';
import AppReady from './AppReady';
import ColoringLimit from './ColoringLimit';
import TutorialStatus from './TutorialStatus';
import TextHistory from './TextHistory';

export default combineReducers({
    appReady: AppReady,
    coloringLimit: ColoringLimit,
    tutorialStatus: TutorialStatus,
    textHistory: TextHistory,
});
