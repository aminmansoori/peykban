import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Text, View, StyleSheet } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { accessToken } from '../../env.json';
import { useSelector } from 'react-redux';
import Bubble from '../components/Bubble';
import moment from 'jalali-moment';

MapboxGL.setAccessToken(accessToken);

const TrackDetailScreen = ({ route }) => {
    const state = useSelector(State => State.trackReducer.TrackList)
    const _id = route.params?._id;
    const track = state.find(t => t._id === _id)
    const initialcoords = track.locations[0].coords;
    const lastLocation = track.locations[track.locations.length - 1].coords
    const shape = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        track.locations.map(loc => [loc.coords.longitude, loc.coords.latitude])
                }
            }
        ]
    }

    return <>
        <View style={{ flex: 1 }}>

            <View style={{ flex: 1 }}>
                <MapboxGL.MapView
                    style={{ height: '100%' }}
                    attributionEnabled={true}
                >
                    <MapboxGL.Camera
                        zoomLevel={16}
                        animationMode={'flyTo'}
                        animationDuration={6000}
                        centerCoordinate={[initialcoords.longitude, initialcoords.latitude]}
                    />

                    <MapboxGL.PointAnnotation
                        fontSize={hp('2%')}
                        id={'1'}
                        title={'مبدا'}
                        selected={true}
                        coordinate={[initialcoords.longitude, initialcoords.latitude]}>
                        <MapboxGL.Callout title={'مبدا'} />
                    </MapboxGL.PointAnnotation>

                    <MapboxGL.PointAnnotation
                        fontSize={hp('2%')}
                        id={'2'}
                        title={'مقصد'}
                        coordinate={[lastLocation.longitude, lastLocation.latitude]}>
                        <MapboxGL.Callout title={'مقصد'} />
                    </MapboxGL.PointAnnotation>

                    <MapboxGL.ShapeSource key={1} id='line1' shape={shape.features[0].geometry}>
                        <MapboxGL.LineLayer id='linelayer1'
                            style={{ lineColor: '#7F0000', lineCap: 'round', lineWidth: 3 }}
                        />

                    </MapboxGL.ShapeSource>

                </MapboxGL.MapView>
            </View>
        </View>

        <Bubble>
            <View style={styles.viewInfo}>

                <View style={styles.viewItem}>
                    <Text style={styles.textTitle}>زمان شروع سفر:</Text>
                    <Text style={styles.textValue}>{moment(track.startTrackTime, 'YYYY/MM/DD HH:mm:ss').locale('fa').format('HH:mm:ss')}</Text>
                    <Text style={styles.textValue}>{moment(track.startTrackTime, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')}</Text>
                </View>
                <View style={styles.viewItem}>
                    <Text style={styles.textTitle}>زمان پایان سفر:</Text>
                    <Text style={styles.textValue}>{moment(track.stopTrackTime, 'YYYY/MM/DD HH:mm:ss').locale('fa').format('HH:mm:ss')}</Text>
                    <Text style={styles.textValue}>{moment(track.stopTrackTime, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')}</Text>
                </View>
                <View style={styles.viewItem}>
                    <Text style={styles.textTitle}>مدت زمان سفر: </Text>
                    <Text style={styles.textValue}>{track.duration}</Text>
                </View>
                <View style={[styles.viewItem, { borderBottomWidth: 0 }]}>
                    <Text style={styles.textTitle}>مسافت طی شده: </Text>
                    <Text style={styles.textValue}>{track.distanceM}</Text>
                    <Text style={styles.textTitle}> متر </Text>
                </View>
            </View>
        </Bubble>
    </>
};

const styles = StyleSheet.create({
    viewInfo: {
        flex: 1,
        margin: hp('1%'),
        borderRadius: wp('2%'),
        paddingHorizontal: wp('2%'),
        paddingVertical: wp('1%'),
        backgroundColor: '#fff'
    },
    viewItem: {
        flexDirection: 'row-reverse',
        borderBottomWidth: 1,
        borderBottomColor: '#aaa5',
    },
    textTitle: {
        color: '#444',
        fontSize: hp('2%'),
        fontFamily: 'Vazir-FD',
        // paddingVertical: hp('1%')
    },
    textValue: {
        color: '#555',
        fontSize: hp('2%'),
        fontFamily: 'Vazir-FD',
        paddingRight: wp('2%'),
        // paddingVertical: hp('1%'),
    }
});

export default TrackDetailScreen;