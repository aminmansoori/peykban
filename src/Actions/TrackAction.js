import trackerApi from '../api/tracker';
import { signOutAction } from '../Actions/AuthAction';
import AsyncStorage from '@react-native-community/async-storage';
import showToastWithGravity from '../components/Toast'

export const createTrackAction = (name, locations, startTrackTime, stopTrackTime) => {
    return async (dispatch) => {
        dispatch({ type: 'spinner', payload: true })
        let result = false;
        try {
            const response = await trackerApi.post('/add-track', { name, locations, startTrackTime, stopTrackTime })
            switch (response.status) {
                case 200: {
                    showToastWithGravity(response.data.message)
                    result = true;
                }
                case 400: {
                    showToastWithGravity(response.data.message)
                    break;
                }
                case 401: {
                    let keys = ['@token', '@name', '@phoneNumber', '@registerDate', '@expiresIn', '@role'];
                    await (
                        AsyncStorage.multiRemove(keys, (err) => {
                            // do most stuff after removal (if you want)
                        }),
                        dispatch({ type: 'save_List_of_Tracks', payload: null })
                    )
                    const token = await AsyncStorage.getItem('@token');
                    dispatch({ type: 'user_token', payload: token })
                    break;
                }
                default: {
                    showToastWithGravity("در حال حاضر ارتباط با سرور برقرار نیست")
                    break;
                }
            }
        } catch (err) {
            showToastWithGravity('createTrackAction: ', err)
        }
        dispatch({ type: 'spinner', payload: false })
        return result;
    }
}

export const removeTrackAction = (name, _id) => {
    return async (dispatch) => {
        dispatch({ type: 'spinner', payload: true })
        try {
            const response = await trackerApi.post('/remove-track', { name, _id })
            switch (response.status) {
                case 200: {
                    dispatch(fetchTrackAction())
                    showToastWithGravity(response.data.message)
                    break;
                }
                case 400: {
                    showToastWithGravity(response.data.message)
                    break;
                }
                case 401: {
                    dispatch(signOutAction())
                    break;
                }
                default: {
                    showToastWithGravity("در حال حاضر ارتباط با سرور برقرار نیست")
                    break;
                }
            }
        } catch (err) {
            showToastWithGravity('removeTrackAction: ', err)
        }
        dispatch({ type: 'spinner', payload: false })
    }
}

export const fetchTrackAction = () => {
    return async (dispatch) => {
        try {
            const response = await trackerApi.get('/tracks')
            switch (response.status) {
                case 200: {
                    saveTrackAction(dispatch, response.data)
                    break;
                }
                case 400: {
                    showToastWithGravity(response.data.message)
                    break;
                }
                case 401: {
                    dispatch(signOutAction())
                    break;
                }
                default: {
                    showToastWithGravity("در حال حاضر ارتباط با سرور برقرار نیست")
                    break;
                }
            }
        } catch (err) {
            showToastWithGravity('fetchTrackAction: ', err)
        }
    }
}

export const saveTrackAction = (dispatch, trackList) => {
    dispatch({
        type: 'save_List_of_Tracks',
        payload: trackList
    })
}