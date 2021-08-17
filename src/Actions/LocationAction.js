export const startRecordingAction = (recording) => {
    return {
        type: 'start_recording',
        payload: recording
    }
}
export const stopRecordingAction = (recording) => {
    return {
        type: 'stop_recording',
        payload: recording,
    }
}
export const addLocationAction = (Location) => {
    return {
        type: 'add_location',
        payload: Location
    }
}
export const resetAction = () => {
    return {
        type: 'reset_location',
    }
}


