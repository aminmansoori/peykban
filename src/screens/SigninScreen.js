import React, { useState } from 'react';
import {
    View, StyleSheet,
    Text, ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { resetFPCSAction, resetSCSAction, resetVCSAction, signInAction } from '../Actions/AuthAction';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { validatephonenumber } from '../utils/validationCheck';
import Spinner from 'react-native-loading-spinner-overlay';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-native-elements';
import Template from '../components/Template';
import PInput from '../components/PInput';
import Styles from '../utils/Styles';

const SigninScreen = (props) => {
    const dispatch = useDispatch();
    const spinner = useSelector(State => State.authReducer.spinner);

    const [errorMsg, setErrorMsg] = useState({ phone: false, password: false });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setPasswordIcon] = useState({ Icon: 'eye-off', value: true });

    const checkError = async () => {
        if (!validatephonenumber(phoneNumber)) {
            setErrorMsg({ phone: true, password: false })
        }
        else if (password.length < 8) {
            setErrorMsg({ phone: false, password: true })
        }
        else {
            Keyboard.dismiss()
            setErrorMsg({ phone: false, password: false })
            dispatch(signInAction(phoneNumber, password))
        }
    }

    const changePasswordIcon = () => {
        if (hidePassword.value === true) {
            setPasswordIcon({ Icon: 'eye', value: false })
        } else {
            setPasswordIcon({ Icon: 'eye-off', value: true })
        }
    }

    return (
        <ScrollView keyboardShouldPersistTaps='handled'>
            <KeyboardAvoidingView behavior="position" >
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <>
                        < Template >
                            <View style={styles.inputView}>
                                <Spinner
                                    visible={spinner}
                                    textContent={'لطفا منتظر بمانید...'}
                                    textStyle={styles.spinnerTextStyle}
                                />
                                <PInput
                                    placeholder='شماره موبایل'
                                    value={phoneNumber}
                                    maxLength={11}
                                    onChangeText={setPhoneNumber}
                                    keyboardType='numeric'
                                    errorMessage={errorMsg.phone ? ('شماره موبایل وارد شده معتبر نمی‌باشد.') : (null)}
                                    iconType='fontisto' iconName='phone'
                                    onFocus={() => setErrorMsg({ phone: false })}
                                />
                                <PInput
                                    placeholder='رمز ورود'
                                    value={password}
                                    maxLength={24}
                                    onChangeText={setPassword}
                                    errorMessage={errorMsg.password ? ('رمز ورود نباید کمتر از 8 کاراکتر باشد') : (null)}
                                    iconType='feather' iconName={hidePassword.Icon}
                                    onPress={() => changePasswordIcon()}
                                    secureTextEntry={hidePassword.value}
                                    onFocus={() => setErrorMsg({ password: false })}
                                />
                            </View>
                        </Template >

                        <View style={{ flex: 1, justifyContent: 'space-evenly' }}>

                            <TouchableOpacity
                                style={Styles.baseBtn}
                                onPress={() => checkError()}
                            >
                                <Text style={Styles.buttomLable}>ورود</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.forgetPassTouch}
                                onPress={() => {
                                    props.navigation.navigate('ForgetPass')
                                    dispatch(resetFPCSAction())
                                    dispatch(resetVCSAction())
                                    setErrorMsg({ phone: false, password: false })
                                }}>
                                <Text style={styles.forgetPassTxt}>فراموشی رمز ورود</Text>
                            </TouchableOpacity>

                            <Button
                                title='ایجاد حساب کاربری'
                                titleStyle={[Styles.buttomLable, { color: '#8a9aa8', fontSize: hp('2.5%') }]}
                                buttonStyle={styles.newAccountBtn}
                                onPress={() => {
                                    props.navigation.navigate('Signup')
                                    dispatch(resetSCSAction())
                                    dispatch(resetVCSAction())
                                    setErrorMsg({ phone: false, password: false })
                                }}
                            />
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF'
    },
    inputView: {
        marginHorizontal: '5%'
    },
    newAccountBtn: {
        height: hp('7%'),
        marginHorizontal: '20%',
        backgroundColor: '#fff',
        borderRadius: hp('3%'),
    },
    forgetPassTouch: {
        marginHorizontal: '20%'
    },
    forgetPassTxt: {
        textAlign: 'center',
        marginVertical: hp('2%'),
        color: '#6495ed',
        fontFamily: 'Vazir-FD',
        fontSize: hp('2%')
    }
});

export default SigninScreen;