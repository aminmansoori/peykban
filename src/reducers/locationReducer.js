const initialState = {
    locations: [],
    name: '',
    recording: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'start_recording': {
            return { ...state, recording: action.payload };
        }
        case 'stop_recording': {
            return { ...state, recording: action.payload };
        }
        case 'add_current_location': {
            return { ...state, currentLocation: action.payload.Location };
        }
        case 'add_location': {
            if (state.recording) {
                return {
                    ...state, currentLocation: action.payload,
                    locations: [...state.locations, action.payload]
                };
            }
            else {
                return { ...state, currentLocation: action.payload };
            }
        }
        case 'reset_location': {
            return { ...state, name: '', locations: [] }
        }
        default: {
            return state;
        }
    }
}
