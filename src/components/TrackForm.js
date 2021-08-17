import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { startRecordingAction, stopRecordingAction, resetAction } from '../Actions/LocationAction';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import Spinner from 'react-native-loading-spinner-overlay';
import { createTrackAction } from '../Actions/TrackAction';
import { View, StyleSheet, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import showToastWithGravity from '../components/Toast';
import { Input, Button } from 'react-native-elements';
import Styles from '../utils/Styles';
import moment from 'jalali-moment';

const startForegroundService = async () => {
    if (Platform.OS == 'android') {
        if (Platform.Version >= 26) {
            await VIForegroundService.createNotificationChannel({
                id: 'locationChannel',
                name: 'Location Tracking Channel',
                description: 'Tracks location of user',
                enableVibration: false,
            });
        }

        return VIForegroundService.startService({
            channelId: 'locationChannel',
            id: 420,
            title: 'Peykban',
            text: 'Tracking location updates',
            icon: 'ic_launcher',
        });

    } else {
        null
    }

};

const stopForegroundService = () => {
    if (Platform.OS == 'android') {
        VIForegroundService.stopService().then(() => {
            console.log("service is stoped successfully")
        }).catch((err) => {
            console.log("service is not stoped successfully")
        });
    } else {
        null
    }
};

const TrackForm = () => {

    useEffect(() => {
        return () => {
            stopForegroundService();
        }
    }, [])

    const [name, setName] = useState('');
    const [startTrackTime, setStartTrackTime] = useState(0);
    const [stopTrackTime, setStopTrackTime] = useState(0);
    const dispatch = useDispatch();
    const spinner = useSelector(State => State.authReducer.spinner);
    const recording = useSelector(State => State.locationReducer.recording);
    const locations = useSelector(State => State.locationReducer.locations);
    const count = locations.length;


    var date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var stillUtc = moment.utc(date).toDate();
    var local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
    return (
        <View >
            <Spinner
                visible={spinner}
                textContent={'لطفا منتظر بمانید...'}
            />
            <Input
                placeholder='عنوان سفر را وارد کنید'
                value={name}
                maxLength={24}
                onChangeText={setName}
                style={styles.inputStyle}
                inputContainerStyle={{ borderBottomWidth: 0 }}
                paddingHorizontal={wp('2%')}
                fontSize={hp('2.5%')}
            />
            {recording ?
                (
                    <Button
                        title='توقف'
                        titleStyle={Styles.buttomLable}
                        buttonStyle={styles.wideBtn}
                        onPress={() => {
                            dispatch(stopRecordingAction(false));
                            setStopTrackTime(local);
                            stopForegroundService();
                        }}
                    />
                ) :
                (
                    <Button
                        title='شروع سفر'
                        titleStyle={Styles.buttomLable}
                        buttonStyle={styles.wideBtn}
                        onPress={() => {
                            setStartTrackTime(local);
                            dispatch(startRecordingAction(true));
                            startForegroundService();
                        }}
                    />
                )
            }
            {(!recording && count) ?
                (
                    <Button
                        title='ثبت سفر'
                        titleStyle={Styles.buttomLable}
                        buttonStyle={styles.wideBtn}
                        onPress={() => {
                            if (name === '') {
                                showToastWithGravity('عنوان سفر نباید خالی باشد')
                            } else {
                                dispatch(createTrackAction(name, locations, startTrackTime, stopTrackTime)).then((result) => {
                                    if (result) {
                                        setName('')
                                        dispatch(resetAction())
                                    }
                                }).catch(() => {
                                    console.log('track was not saved')
                                })

                            }
                        }}
                    />
                ) :
                (null)
            }
        </View>
    );
}
const styles = StyleSheet.create({
    inputStyle: {
        backgroundColor: '#fff',
        borderRadius: hp('1%'),
        height: hp('7%')
    },
    wideBtn: {
        height: hp('7%'),
        marginHorizontal: '2%',
        backgroundColor: '#c3f',
        borderRadius: hp('1%'),
        marginBottom: hp('1.5%')
    }
});

export default TrackForm;