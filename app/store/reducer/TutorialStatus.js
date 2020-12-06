import * as actions from '../actions/TutorialStatus';

const initialState = {
    editTutorial: false,
}

export default (state = initialState, action) =>
{
    switch (action.type)
    {
        case actions.SET_EDIT_TUTORIAL_SUCCESS:
            state.editTutorial = true;
            break;
        default:
        // do nothing
            break;
    }

    return state;
}

