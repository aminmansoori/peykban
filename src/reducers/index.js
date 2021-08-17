import { combineReducers } from 'redux';
import userTokenReducer from './userTokenReducer';
import isLoadingReducer from './isLoadingReducer';
import authReducer from './authReducer';
import locationReducer from './locationReducer';
import trackReducer from './trackReducer';
export default combineReducers({
    userTokenReducer,
    isLoadingReducer,
    locationReducer,
    authReducer,
    trackReducer
})