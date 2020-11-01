import * as actions from '../actions/AppReady';

const initialState = {
    isReady: false,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case actions.READY_COMPLETE:
            state.isReady = true;
        default :
            // do nothing
    }

    return state;
}

