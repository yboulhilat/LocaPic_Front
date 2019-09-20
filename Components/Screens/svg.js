import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Header } from 'react-native-elements'
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps'

class PageBscreen extends React.Component {

    constructor() {
        super();
        this.state = { currentPosition: { latitude: 0, longitude: 0 } };
    }

    componentWillMount() {
        this._getLocationAsync();
    }

    _getLocationAsync = async () => {
        var { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        Location.watchPositionAsync({ distanceInterval: 5 },
            (location) => {
                this.setState({
                    currentPosition: { latitude: location.coords.latitude, longitude: location.coords.longitude }
                });
                console.log(this.state.currentPosition)

            }
        )
    }
    render() {
        return (

            <MapView
                style={{
                    flex: 1,
                }}
                region={{
                    latitude: this.state.currentPosition.latitude,
                    longitude: this.state.currentPosition.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}
                showsUserLocation={true}>
                <Marker
                    coordinate={this.state.currentPosition}
                    title="Yoann"
                    description="Président"
                    draggable
                />
                <Header
                    statusBarProps={{ barStyle: 'light-content' }}
                    barStyle="light-content"
                    centerComponent={{ text: 'LocaPic - Map', style: { color: '#fff', fontSize: 20, fontWeight: "bold" } }}
                    containerStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'space-around',
                        borderBottomColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                />
            </MapView>
        );
    }
}

function mapStateToProps(state) {
    console.log(state)
    return { user: state.userData };
}

export default connect(mapStateToProps, null)(PageBscreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

});