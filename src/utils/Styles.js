import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Styles = StyleSheet.create({
    baseBtn: {
        height: hp('7%'),
        marginHorizontal: '20%',
        backgroundColor: '#c3f',
        borderRadius: hp('3%'),
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttomLable: {
        fontFamily: 'Vazir-FD',
        fontSize: hp('2.5%'),
        color: "#fff",
    },
})

export default Styles;