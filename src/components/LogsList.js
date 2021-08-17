import React, { useEffect, useState } from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, StyleSheet, FlatList, Text, SafeAreaView } from 'react-native';
import { ListItem } from 'react-native-elements'
import trackerApi from '../api/tracker';
import moment from 'jalali-moment';

const LogsList = (logList) => {

    const [logs, setLogs] = useState()
    const [message, setmessage] = useState('')

    useEffect(() => {
        async function fetchData() {
            let response = await trackerApi.get('./logs')
            if (response.status === 200) {
                setLogs(response.data)
            }
            else {
                setmessage('سطح دسترسی شما محدود است.')
            }
        }
        fetchData();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {logs ?
                <FlatList
                    data={logs}
                    renderItem={({ item }) => (

                        <ListItem bottomDivider >
                            <ListItem.Content>
                                <View style={styles.titleView}>

                                    <ListItem.Title
                                        style={{ fontSize: hp('2.3%') }}
                                    >{item.level}</ListItem.Title>

                                    <ListItem.Title style={{ fontFamily: 'Vazir-FD', fontSize: hp('2.3%') }}>
                                        {moment(item.timestamp, 'YYYY/MM/DD HH:mm:ss').locale('fa').format('YYYY/MM/DD  HH:mm:ss')}
                                    </ListItem.Title>

                                </View>

                                <ListItem.Subtitle style={styles.subtitleText}>{item.message}</ListItem.Subtitle>

                            </ListItem.Content>

                        </ListItem>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
                :
                <View style={styles.messageView}>
                    <Text style={styles.messageText}>{message}</Text>
                </View>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    titleView: {
        width: '100%',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between'
    },
    subtitleText: {
        fontFamily: 'Vazir-FD',
        fontSize: hp('2%')
    },
    messageView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    messageText: {
        fontSize: 18,
        fontFamily: 'Vazir-FD',
        fontSize: hp('2.5%')
    }
})
export default LogsList;