import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { accessToken } from '../../env.json';
import { useSelector } from 'react-redux';

MapboxGL.setAccessToken(accessToken);

export default App = (props) => {
    const currentLocation = useSelector(State => State.locationReducer.currentLocation);
    const Locations = useSelector(State => State.locationReducer.locations);

    const shape = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        Locations.map(loc => [loc.coords.longitude, loc.coords.latitude])
                }
            }
        ]
    }

    if (currentLocation === undefined) {
        return (
            <View style={{ paddingTop: '25%' }}>
                <ActivityIndicator size='large' color='green' />
            </View>
        )
    }

    return (
        <MapboxGL.MapView style={styles.container}>

            <MapboxGL.Camera
                zoomLevel={16}
                followUserMode={'normal'}
                showUserLocation={true}
                centerCoordinate={[currentLocation.coords.longitude, currentLocation.coords.latitude]}
            />

            <MapboxGL.PointAnnotation
                id={'2'}
                title={'مقصد'}
                coordinate={[currentLocation.coords.longitude, currentLocation.coords.latitude]}>
                <MapboxGL.Callout />
            </MapboxGL.PointAnnotation>

            {shape.features[0].geometry.coordinates == 0 ?
                null :
                <MapboxGL.ShapeSource key={1} id='line1' shape={shape.features[0].geometry}>
                    <MapboxGL.LineLayer id='linelayer1'
                        style={{ lineColor: '#7F0000', lineCap: 'round', lineWidth: 3 }}
                    />
                </MapboxGL.ShapeSource>
            }
        </MapboxGL.MapView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});