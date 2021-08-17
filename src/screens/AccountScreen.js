import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { signOutAction } from '../Actions/AuthAction';
import DeviceInfo from 'react-native-device-info';
import Template from '../components/Template';
import { Icon } from 'react-native-elements';
import Spacer from '../components/Spacer';
import { useDispatch } from 'react-redux';
import Styles from '../utils/Styles';
import moment from 'jalali-moment';


const AccountScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [info, setInfo] = useState({ name: '', phoneNumber: '', registerDate: '' });

    useEffect(() => {
        getInfo()
    }, [])

    const getInfo = async () => {
        try {
            setInfo({
                name: await AsyncStorage.getItem('@name'),
                phoneNumber: await AsyncStorage.getItem('@phoneNumber'),
                registerDate: await AsyncStorage.getItem('@registerDate'),
                role: await AsyncStorage.getItem('@role')
            })
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Template>
                {info.role === "administrator" ?
                    <View style={styles.settingsView}>
                        <Icon name='settings' color='white' size={hp('4%')}
                            onPress={() => {
                                navigation.navigate('LogsList')
                            }}
                        />
                    </View> :
                    null
                }

                <Spacer>
                    <View style={styles.viewItem}>
                        <Text style={styles.textTitle}>نام و نام خانوادگی: </Text>
                        <Text style={styles.textValue}>{info.name}</Text>
                    </View>

                    <View style={styles.viewItem}>
                        <Text style={styles.textTitle}>شماره موبایل: </Text>
                        <Text style={styles.textValue}>{info.phoneNumber}</Text>
                    </View>

                    <View style={styles.viewItem}>
                        <Text style={styles.textTitle}>تاریخ عضویت: </Text>
                        <Text style={styles.textValue}>
                            {info.registerDate ?
                                moment(info.registerDate, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD') :
                                null
                            }
                        </Text>
                    </View>
                </Spacer>
            </Template>

            <View style={{ flex: 1 }}>

                <TouchableOpacity
                    style={Styles.baseBtn}
                    onPress={() => dispatch(signOutAction())}
                >
                    <Text style={Styles.buttomLable}>خروج از حساب کاربری</Text>
                </TouchableOpacity>

                <View style={styles.viewVersion}>
                    <Text style={styles.textVersion}>نسخه برنامه: {DeviceInfo.getVersion()}</Text>
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    settingsView: {
        width: '100%',
        paddingLeft: wp('4%'),
        paddingTop: hp('2%'),
        flexDirection: 'row-reverse',
        position: 'absolute',
        zIndex: 1,
        paddingTop: Platform.select({ ios: hp('5%'), android: hp('3%') })
    },
    viewItem: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#fff2',
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('1%'),
        marginBottom: hp('1%'),
        borderRadius: 5
    },
    textTitle: {
        fontFamily: 'Vazir-FD',
        color: '#fff',
        fontSize: hp('2%')
    },
    textValue: {
        fontFamily: 'Vazir-FD',
        color: '#fff',
        fontSize: hp('2.5%')
    },
    viewVersion: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        bottom: 5
    },
    textVersion: {
        fontFamily: 'Vazir-FD',
        color: '#aaa',
        fontSize: hp('2%'),
    }
});

export default AccountScreen;