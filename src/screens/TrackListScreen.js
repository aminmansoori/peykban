import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import GmailStyleSwipeableRow from '../components/swipeable/GmailStyleSwipeableRow';
import { NavigationEvents } from '@react-navigation/compat';
import { fetchTrackAction } from '../Actions/TrackAction';
import { useDispatch, useSelector } from 'react-redux';
import { ListItem, Icon } from 'react-native-elements';

const Row = ({ item, navigation }) => (
    <TouchableOpacity style={styles.rectButton}
        onPress={() => navigation.navigate("TrackDetail", { _id: item._id, name: item.name })}
    >
        <ListItem
            containerStyle={{ flexDirection: 'row-reverse' }}
        >
            <Image
                source={require('../../assets/images/LocationIcon.png')}
                style={{
                    width: hp('5%'),
                    height: hp('5%'),
                    borderRadius: 90,
                    marginVertical: -5
                }}
            />
            <ListItem.Content>
                <Text style={styles.itemText}>{item.name}</Text>
            </ListItem.Content>
            <Icon name='chevron-left' color='#9d42cd' size={hp('3%')} />
        </ListItem>

    </TouchableOpacity>
);

const SwipeableRow = ({ item, index, navigation }) => {
    return (
        <GmailStyleSwipeableRow name={item.name} id={item._id}>
            <Row item={item} navigation={navigation} />
        </GmailStyleSwipeableRow>
    );
};

const TrackListScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const state = useSelector(State => State.trackReducer.TrackList)

    return <>
        <NavigationEvents onWillFocus={() => dispatch(fetchTrackAction())} />
        { state === null ?
            <ActivityIndicator
                size="large"
                color="green"
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            />
            :
            // state == []
            state == 0 ?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Vazir-FD', fontSize: wp('4%') }}>شما هنوز سفری ثبت نکرده‌اید</Text>
                </View>
                :
                < FlatList
                    data={state}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={({ item, index }) => (
                        <SwipeableRow item={item} index={index} navigation={navigation} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
        }
    </>
}

const styles = StyleSheet.create({
    rectButton: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    separator: {
        backgroundColor: 'rgb(200, 199, 204)',
        height: StyleSheet.hairlineWidth,
    },
    fromText: {
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        textAlign: 'right'
    },
    itemText: {
        width: '100%',
        textAlign: 'right',
        fontSize: wp('3.5%'),
        color: '#555',
        fontFamily: 'Vazir-FD'
    }
});

export default TrackListScreen;