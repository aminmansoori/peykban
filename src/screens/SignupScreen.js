import React, { useEffect, useState } from 'react';
import { resetSCSAction, signUpAction, signUpCodeAction, verifyCodeAction } from '../Actions/AuthAction';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { validatephonenumber } from '../utils/validationCheck';
import { useDispatch, useSelector } from 'react-redux';
import Template from '../components/Template';
import PInput from '../components/PInput';
import Styles from '../utils/Styles';

const SignupScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const signupCodeStatus = useSelector(State => State.authReducer.signupCodeStatus);
    const verifyCodeStatus = useSelector(State => State.authReducer.verifyCodeStatus);
    const maxCounter = 60;

    const [step, setStep] = useState({ step1: true, step2: false, step3: false });
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [approvalCode, setApprovalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [counter, setCounter] = useState(maxCounter);
    const [name, setName] = useState('');
    const [errorMsg, setErrorMsg] = useState({
        phone: false, approvalCode: false, name: false,
        password: false, confirmPass: false
    });


    useEffect(() => {
        const timer =
            0 < counter < maxCounter &&
            setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter]);

    const checkError = () => {
        if (name.length < 2) {
            setErrorMsg({
                phone: false, approvalCode: false, name: true,
                password: false, confirmPass: false
            })
        }
        else if (password.length < 8) {
            setErrorMsg({
                phone: false, approvalCode: false, name: false,
                password: true, confirmPass: false
            })
        }
        else if (confirmedPassword != password) {
            setErrorMsg({
                phone: false, approvalCode: false, name: false,
                password: false, confirmPass: true
            })
        }
        else {
            Keyboard.dismiss()
            setErrorMsg({
                phone: false, approvalCode: false, name: false,
                password: false, confirmPassw: false
            })
            dispatch(signUpAction(phoneNumber, password, name))
        }
    }

    return (
        <ScrollView keyboardShouldPersistTaps='handled'>
            <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={20}>
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }} >
                    <>
                        {step.step1 ? (
                            <>
                                <Template>
                                    <View style={styles.inputView}>
                                        <PInput
                                            placeholder='شماره موبایل'
                                            value={phoneNumber}
                                            onChangeText={setPhoneNumber}
                                            keyboardType='numeric'
                                            errorMessage={errorMsg.phone ? ('شماره موبایل وارد شده معتبر نیست.') : (null)}
                                            iconType='fontisto' iconName='phone'
                                            onFocus={() => {
                                                setErrorMsg({ phone: false })
                                            }}
                                        />
                                    </View>
                                </Template>

                                <TouchableOpacity style={Styles.baseBtn}
                                    onPress={() => {
                                        validatephonenumber(phoneNumber) ? (
                                            Keyboard.dismiss(),
                                            dispatch(signUpCodeAction(phoneNumber))) :
                                            setErrorMsg({ phone: true })
                                    }}
                                >
                                    <Text style={Styles.buttomLable}>ارسال شماره موبایل</Text>
                                </TouchableOpacity>

                                {signupCodeStatus ?
                                    (setStep({ step1: false, step2: true, step3: false }),
                                        counter === maxCounter ? setCounter(counter - 1) : setCounter(maxCounter - 1)
                                    ) : (null)
                                }
                            </>
                        ) : null}

                        {step.step2 ? (
                            <>
                                <Template>
                                    <View style={styles.inputView}>
                                        <PInput
                                            placeholder='کد تایید'
                                            value={approvalCode}
                                            onChangeText={setApprovalCode}
                                            keyboardType='numeric'
                                            errorMessage={errorMsg.approvalCode ? ('کد وارد شده معتبر نیست.') : (null)}
                                            iconType='feather' iconName='message-circle'
                                        />
                                        <Text style={{ color: "#fff", textAlign: 'center', fontSize: hp('2%') }}>
                                            {`زمان باقیمانده برای ورود کد تایید ${counter} ثانیه`}
                                            {counter === 0 ? (
                                                dispatch(resetSCSAction()),
                                                setStep({ step1: true, step2: false, step3: false })
                                            ) : (null)}
                                        </Text>
                                    </View>

                                </Template>

                                <TouchableOpacity style={Styles.baseBtn}
                                    onPress={() => {
                                        if (approvalCode.length < 4) {
                                            setErrorMsg({ approvalCode: true })
                                        } else {
                                            Keyboard.dismiss()
                                            dispatch(verifyCodeAction(phoneNumber, approvalCode))
                                        }
                                    }}
                                >
                                    <Text style={Styles.buttomLable}>ورود کد تایید</Text>
                                </TouchableOpacity>

                                {verifyCodeStatus ?
                                    (setStep({ step1: false, step2: false, step3: true }),
                                        setCounter(maxCounter)
                                    ) : null
                                }
                            </>
                        ) : null}

                        {step.step3 ? (
                            <>
                                <Template>
                                    <View style={styles.inputView}>
                                        <PInput
                                            placeholder='نام و نام خانوادگی'
                                            value={name}
                                            maxLength={24}
                                            onChangeText={setName}
                                            errorMessage={errorMsg.name ? ('نام نمی‌تواند خالی باشد') : (null)}
                                            iconType='fontisto' iconName='person'
                                            onFocus={() => setErrorMsg({ name: false })}
                                        />

                                        <PInput
                                            placeholder='رمز ورود'
                                            value={password}
                                            maxLength={24}
                                            onChangeText={setPassword}
                                            errorMessage={errorMsg.password ? ('رمز ورود نباید کمتر از 8 کاراکتر باشد') : (null)}
                                            iconType='antdesign' iconName='lock1'
                                            secureTextEntry
                                            onFocus={() => setErrorMsg({ password: false })}
                                        />

                                        <PInput
                                            placeholder='تکرار رمز ورود'
                                            value={confirmedPassword}
                                            maxLength={24}
                                            onChangeText={setConfirmedPassword}
                                            errorMessage={errorMsg.confirmPass ? ('رمز عبور با تکرار رمز عبور همخوانی ندارد') : (null)}
                                            iconType='antdesign' iconName='lock1'
                                            secureTextEntry
                                            onFocus={() => setErrorMsg({ confirmPass: false })}
                                        />
                                    </View>
                                </Template>

                                <TouchableOpacity style={Styles.baseBtn}
                                    onPress={() => checkError()}
                                >
                                    <Text style={Styles.buttomLable}>عضویت</Text>
                                </TouchableOpacity>
                            </>
                        ) : null}

                        <TouchableOpacity style={{ flex: 1, alignItems: 'center', paddingVertical: hp('2%') }}
                            onPress={() => navigation.navigate('Signin')}>
                            <Text style={{ color: '#6495ed', fontSize: hp('2%') }}>قبلا ثبت نام کرده‌ام. ورود!</Text>
                        </TouchableOpacity>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    inputView: {
        marginHorizontal: '5%',
    },
});

export default SignupScreen;