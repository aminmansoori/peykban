import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, } from 'react-native';
import { forgetPasswordCodeAction, verifyCodeAction, forgetPasswordAction, resetFPCSAction } from '../Actions/AuthAction';
import { validatephonenumber } from '../utils/validationCheck';
import { useDispatch, useSelector } from 'react-redux';
import Template from '../components/Template';
import PInput from '../components/PInput';
import Styles from '../utils/Styles';

const ForgetPass = ({ navigation }) => {
    const dispatch = useDispatch();
    const forgetPasswordCodeStatus = useSelector(State => State.authReducer.forgetPasswordCodeStatus);
    const verifyCodeStatus = useSelector(State => State.authReducer.verifyCodeStatus);
    const maxCounter = 60;

    const [step, setStep] = useState({ step1: true, step2: false, step3: false });
    const [confirmedPassword, setconfirmedPassword] = useState('');
    const [approvalCode, setApprovalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [counter, setCounter] = useState(maxCounter);
    const [errorMsg, setErrorMsg] = useState({
        phone: false, approvalCode: false, password: false, confirmPass: false
    });

    useEffect(() => {
        const timer =
            0 < counter < maxCounter &&
            setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter]);

    const checkError = () => {
        if (password.length < 8) {
            setErrorMsg({
                phone: false, approvalCode: false,
                password: true, confirmPass: false
            })
        }
        else if (confirmedPassword != password) {
            setErrorMsg({
                phone: false, approvalCode: false,
                password: false, confirmPass: true
            })
        }
        else {
            setErrorMsg({
                phone: false, approvalCode: false,
                password: false, confirmPassw: false
            })
            dispatch(forgetPasswordAction(phoneNumber, password))
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
                                            maxLength={11}
                                            onChangeText={setPhoneNumber}
                                            keyboardType='numeric'
                                            errorMessage={errorMsg.phone ? ('شماره موبایل وارد شده معتبر نیست.') : (null)}
                                            iconType='fontisto' iconName='phone'
                                            onFocus={() => setErrorMsg({ password: false })}
                                        />
                                    </View>
                                </Template>

                                <TouchableOpacity style={Styles.baseBtn}
                                    onPress={() => {
                                        validatephonenumber(phoneNumber) ? (
                                            Keyboard.dismiss(),
                                            dispatch(forgetPasswordCodeAction(phoneNumber))) :
                                            setErrorMsg({ phone: true })
                                    }}
                                >
                                    <Text style={Styles.buttomLable}>ارسال شماره موبایل</Text>
                                </TouchableOpacity>

                                {forgetPasswordCodeStatus ?
                                    (setStep({ step1: false, step2: true, step3: false }),
                                        counter === maxCounter ? setCounter(counter - 1) : setCounter(maxCounter - 1)
                                    ) : null
                                }
                            </>
                        ) : null
                        }

                        {
                            step.step2 ? (
                                <>
                                    <Template>
                                        <View style={styles.inputView}>
                                            <PInput
                                                placeholder='کد تایید'
                                                value={approvalCode}
                                                maxLength={10}
                                                onChangeText={setApprovalCode}
                                                keyboardType='numeric'
                                                errorMessage={errorMsg.approvalCode ? ('کد وارد شده معتبر نیست.') : (null)}
                                                iconType='feather' iconName='message-circle'
                                            />
                                            <Text style={{ color: "#fff", textAlign: 'center' }}>
                                                {`زمان باقیمانده برای ورود کد تایید ${counter} ثانیه`}
                                                {counter === 0 ? (
                                                    setStep({ step1: true, step2: false, step3: false }),
                                                    dispatch(resetFPCSAction))
                                                    : (null)}
                                            </Text>
                                        </View>
                                    </Template>

                                    <TouchableOpacity style={styles.baseBtn}
                                        onPress={() => {
                                            if (approvalCode.length < 4) {
                                                setErrorMsg({ approvalCode: true })
                                            } else {
                                                Keyboard.dismiss()
                                                setCounter(20)
                                                dispatch(verifyCodeAction(phoneNumber, approvalCode))
                                            }
                                        }}
                                    >
                                        <Text style={styles.buttomLable}>ورود کد تایید</Text>
                                    </TouchableOpacity>

                                    {verifyCodeStatus ?
                                        setStep({ step1: false, step2: false, step3: true }) : null
                                    }
                                </>
                            ) : null
                        }

                        {
                            step.step3 ? (
                                <>
                                    <Template>
                                        <View style={styles.inputView}>

                                            <PInput
                                                placeholder='رمز ورود'
                                                value={password}
                                                maxLength={24}
                                                onChangeText={setPassword}
                                                iconType='antdesign' iconName='lock1'
                                                onFocus={() => setErrorMsg({ password: false })}
                                            />
                                            <PInput
                                                placeholder='تکرار رمز ورود'
                                                value={confirmedPassword}
                                                maxLength={24}
                                                onChangeText={setconfirmedPassword}
                                                errorMessage={errorMsg.confirmPass ? ('رمز وارد شده معتبر نیست.') : (null)}
                                                iconType='antdesign' iconName='lock1'
                                                onFocus={() => setErrorMsg({ password: false })}
                                            />
                                        </View>
                                    </Template>

                                    <TouchableOpacity style={styles.baseBtn}
                                        onPress={() => {
                                            checkError()
                                            Keyboard.dismiss()
                                        }}
                                    >
                                        <Text style={styles.buttomLable}>ثبت رمز جدید</Text>
                                    </TouchableOpacity>
                                </>
                            ) : null
                        }
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
        marginHorizontal: '5%',
    },
});

export default ForgetPass;