import React, { useCallback } from 'react';
import { NavigationEvents, withNavigationFocus } from '@react-navigation/compat';
import { addLocationAction } from '../Actions/LocationAction';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import TrackForm from '../components/TrackForm';
import useLocation from '../hooks/useLocation';
import Bubble from '../components/Bubble';
import Map from '../components/Map';

const TrackCreateScreen = ({ isFocused }) => {

    const dispatch = useDispatch();
    const recording = useSelector(State => State.locationReducer.recording)
    const callback = useCallback(location => { dispatch(addLocationAction(location, recording)) }, [recording])
    const [err] = useLocation(isFocused || recording, callback)
    // const [err] = useLocation(recording, callback)

    return (
        <>
            <Map />

            <NavigationEvents />

            <Bubble>
                <TrackForm />
            </Bubble>
        </>
    )
};

export default withNavigationFocus(TrackCreateScreen);