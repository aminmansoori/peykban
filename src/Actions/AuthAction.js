import trackerApi from '../api/tracker';
import AsyncStorage from '@react-native-community/async-storage';
import { versionHandling } from '../Actions/VersionAction';
import showToastWithGravity from '../components/Toast'


export const signInAction = (phoneNumber, password) => {
    return async (dispatch) => {
        dispatch({ type: 'spinner', payload: true })
        try {
            const response = await trackerApi.post('/signin', { phoneNumber, password });
            switch (response.status) {
                case 200: {
                    saveInfo(
                        response.data.token,
                        response.data.info,
                    );
                    dispatch(versionHandling());
                    break;
                }
                case 400: {
                    showToastWithGravity(response.data.message);
                    break;
                }
                default: {
                    showToastWithGravity("در حال حاضر ارتباط با سرور برقرار نیست")
                    break;
                }
            }
        } catch (err) {
            showToastWithGravity('signInAction: ', err)
        }
        dispatch({ type: 'spinner', payload: false })
    }
}

//////////////////////////  signUp    /////////////////////////////////

export const signUpCodeAction = (phoneNumber) => {
    return async (dispatch) => {
        dispatch({ type: 'signup_code_status', payload: false })
        dispatch({ type: 'spinner', payload: true })
        try {
            const response = await trackerApi.post('/signup-code', { phoneNumber });
            switch (response.status) {
                case 200: {
                    dispatch({ type: 'signup_code_status', payload: true })
                    break;
                }
                case 400: {
                    showToastWithGravity(response.data.message)
                    break;
                }
                default: {
                    showToastWithGravity("در حال حاضر ارتباط با سرور برقرار نیست")
                    break;
                }
            }
        } catch (err) {
            showToastWithGravity('signUpCodeAction: ', err)
        }
        dispatch({ type: 'spinner', payload: false })
    }
}

export const signUpAction = (phoneNumber, password, name) => {
    return async (dispatch) => {
        dispatch({ type: 'spinner', payload: true })
        try {
            const response = await trackerApi.post('/signup', { phoneNumber, password, name });
            switch (response.status) {
                case 200: {
                    saveInfo(
                        response.data.token,
                        response.data.info
                    );
                    dispatch(versionHandling());
                    break;
                }
                case 400: {
                    showToastWithGravity(response.data.message)
                    break;
                }
                default: {
                    showToastWithGravity("در حال حاضر ارتباط با سرور برقرار نیست")
                    break;
                }
            }

        } catch (err) {
            showToastWithGravity('signUpAction: ', err)
        }
        dispatch({ type: 'spinner', payload: false })
    }
}

////////////////////////    forgetPassword    ////////////////////////////

export const forgetPasswordCodeAction = (phoneNumber) => {
    return async (dispatch) => {
        dispatch({ type: 'spinner', payload: true })
        try {
            const response = await trackerApi.post('/forget-password-code', { phoneNumber });
            switch (response.status) {
                case 200: {
                    dispatch({ type: 'forget_password_code_status', payload: true })
                    break;
                }
                case 400: {
                    showToastWithGravity(response.data.message)
                    break;
                }
                default: {
                    showToastWithGravity("در حال حاضر ارتباط با سرور برقرار نیست")
                    break;
                }
            }
        } catch (err) {
            showToastWithGravity('forgetPasswordCodeAction: ', err)
        }
        dispatch({ type: 'spinner', payload: false })
    }
}

export const forgetPasswordAction = (phoneNumber, password) => {
    return async (dispatch) => {
        dispatch({ type: 'spinner', payload: true })
        try {
            const response = await trackerApi.post('/change-password', { phoneNumber, password });
            switch (response.status) {
                case 200: {
                    saveInfo(
                        response.data.token,
                        response.data.info
                    );
                    dispatch(versionHandling());
                    break;
                }
                case 400: {
                    showToastWithGravity(response.data.message)
                    break;
                }
                default: {
                    showToastWithGravity("در حال حاضر ارتباط با سرور برقرار نیست")
                    break;
                }
            }
        } catch (err) {
            showToastWithGravity('forgetPasswordAction: ', err)
        }
        dispatch({ type: 'spinner', payload: false })
    }
}

////////////////////////     VerifyCodeAction     //////////////////////////////////

export const verifyCodeAction = (phoneNumber, approvalCode) => {
    return async (dispatch) => {
        dispatch({ type: 'spinner', payload: true })
        try {
            const response = await trackerApi.post('/verify-code', { phoneNumber, approvalCode });
            switch (response.status) {
                case 200: {
                    dispatch({ type: 'verify_code_status', payload: true })
                    break;
                }
                case 400: {
                    showToastWithGravity(response.data.message)
                    break;
                }
                default: {
                    showToastWithGravity("در حال حاضر ارتباط با سرور برقرار نیست")
                    break;
                }
            }
        } catch (err) {
            showToastWithGravity('verifyCodeAction: ', err)
        }
        dispatch({ type: 'spinner', payload: false })
    }
}
////////////////////////////    Reset Action    //////////////////////

/* Forget Password Code Status (FPCS)*/
export const resetFPCSAction = () => {
    return async (dispatch) => {
        dispatch({ type: 'forget_password_code_status', payload: false })
    }
}

export const resetVCSAction = () => {
    return async (dispatch) => {
        dispatch({ type: 'verify_code_status', payload: false })
    }
}

export const resetSCSAction = () => {
    return async (dispatch) => {
        dispatch({ type: 'signup_code_status', payload: false })
    }
}
/////////////////////////       saveInfo      ///////////////////////////

const saveInfo = async (token, info) => {
    try {
        const items = [
            ['@token', token],
            ['@name', info.name],
            ['@phoneNumber', info.phoneNumber],
            ['@registerDate', info.registerDate],
            ['@expiresIn', info.expiresIn],
            ['@role', info.role]
        ]
        await (
            AsyncStorage.multiSet(items, (err) => {
                // do most stuff after removal (if you want)
            })
        )
    } catch (err) {
        showToastWithGravity('saveInfo: ', err);
    }
}
//////////////////////////     signOut Action     /////////////////////

export const signOutAction = () => {
    return async (dispatch) => {
        try {
            let keys = ['@token', '@name', '@phoneNumber', '@registerDate', '@expiresIn', '@role'];
            await (
                AsyncStorage.multiRemove(keys, (err) => {
                    // do most stuff after removal (if you want)
                }),
                dispatch({ type: 'reset_location' }),
                dispatch({ type: 'save_List_of_Tracks', payload: null })
            )
            const token = await AsyncStorage.getItem('@token');
            dispatch({ type: 'user_token', payload: token })
        } catch (err) {
            showToastWithGravity('signOutAction: ', err);
        }
    }
}
////////////////////////                 ///////////////////////////
