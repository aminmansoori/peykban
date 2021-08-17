import { useState, useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export default (shouldTrack, successCallback) => {
    const [err, setErr] = useState('useLocation Error')

    useEffect(() => {
        let subscriber;

        const startWatching = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Required',
                        message: 'This App needs to Access your location',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    try {
                        subscriber = Geolocation.watchPosition(
                            successCallback,
                            (error) => {
                                console.log(error.code, 'error location: ', error.message);
                            },
                            {
                                enableHighAccuracy: true,
                                distanceFilter: 0,
                                interval: 5000,
                                fastestInterval: 2000,
                                forceRequestLocation: true,
                                showLocationDialog: true,
                            },
                        );
                    } catch (err) {
                        setErr(err)
                        console.log('watchPosition: ', err)
                    }
                }
            }
            if (Platform.OS === 'ios') {
                try {
                    subscriber = Geolocation.watchPosition(
                        successCallback,
                        (error) => {
                            console.log(error.code, 'error location: ', error.message);
                        },
                        {
                            enableHighAccuracy: true,
                            distanceFilter: 0,
                            interval: 5000,
                            fastestInterval: 2000,
                            forceRequestLocation: true,
                            showLocationDialog: true,
                        },
                    );
                } catch (err) {
                    setErr(err)
                    console.log('watchPosition: ', err)
                }
            }
        }
        if (shouldTrack) {
            startWatching();
        } else {
            if (subscriber) {
                Geolocation.clearWatch(subscriber)
            }
            subscriber = null
        }

        return () => {
            if (subscriber) {
                Geolocation.clearWatch(subscriber)
                subscriber = null
            }
        }
    }, [shouldTrack, successCallback]);

    return [err];
}