import React, { useEffect } from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import { versionHandling } from '../Actions/VersionAction';
import { View, Text, Image, StyleSheet } from 'react-native';
import { signOutAction } from '../Actions/AuthAction';
import { version } from '../../package.json';
import { useDispatch } from 'react-redux';

const Splash = () => {
    const dispatch = useDispatch();
    useEffect(() => { checkVersion() }, [])

    const checkVersion = async () => {
        const isExpired = await checkExpiration()
        if (isExpired) {
            dispatch({ type: 'isLoading', payload: false })
        }
        else {
            dispatch(versionHandling())
        }
    }

    const checkExpiration = async () => {
        try {
            const jsonExpiresIn = await AsyncStorage.getItem('@expiresIn')
            if (jsonExpiresIn) {
                /* backToDate = new Date(jsonDate)*/
                const expiresIn = new Date(jsonExpiresIn)
                const oneDay = addDays(new Date(), 1);
                if (expiresIn < oneDay) {
                    dispatch(signOutAction())
                    return true
                }
                return false;
            }
            return true
        } catch (err) {
            console.log(err);
        }
    }

    const addDays = (date, days) => {
        const copy = new Date(Number(date));
        copy.setDate(date.getDate() + days);
        return copy
    }

    return (
        <View style={{ flex: 1, margin: '20%' }}>
            <Image source={require('../../assets/images/logo.png')}
                style={{ width: '100%', height: '100%', resizeMode: 'contain', }}
            />
            <View style={styles.viewVersion}>
                <Text style={styles.textVersion}>نسخه برنامه: {version}</Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    viewVersion: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    textVersion: {
        fontFamily: 'Vazir-FD',
        color: '#fff',
        fontSize: hp('2.5%'),
    }
});
export default Splash;
