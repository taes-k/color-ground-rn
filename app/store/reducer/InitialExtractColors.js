import * as actions from '../actions/InitialExtractColors';

const colors = [];

export default (state = initialState, action) => {
    switch (action.type) {
        case actions.ADD_COLOR:
            colors.push({
                coordX: actions.coordX,
                coordY: actions.coordY, 
                red: actions.red,
                gree: actions.green,
                blue: actions.blue,
                hue: actions.hue,
                saturation: actions.saturation,
                brightness: actions.brightness
            });
        case actions.CLEAR_COLORS:
            state.colors = [];
        default :
            // do nothing
    }

    return state;
}
