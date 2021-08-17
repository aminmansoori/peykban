import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Template = ({ children }) => {

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/kaver.png')}
                style={styles.kaverImage}
            />

            <View style={styles.logoView}>
                <Image source={require('../../assets/images/logo.png')}
                    style={styles.logoImage}
                />
            </View>

            {children}

        </View>
    );
};
export default Template;

const styles = StyleSheet.create({
    container: {
        height: hp('70%'),
        marginBottom: hp('2%')
    },
    kaverImage: {
        width: '100%',
        height: '100%',
        borderBottomLeftRadius: hp('8%'),
        borderBottomRightRadius: hp('8%'),
        position: 'absolute'
    },
    logoView: {
        alignItems: 'center',
        marginVertical: hp('8%'),
        marginBottom: hp('12%')
    },
    logoImage: {
        height: hp('15%'),
        width: hp('15%'),
    }
})