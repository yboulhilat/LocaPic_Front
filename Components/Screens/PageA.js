import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { Header, Avatar, Tile, Button,  } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import RetroMapStyles from '../Maps/map.json';

import { connect } from 'react-redux';
import MapView , { PROVIDER_GOOGLE }  from 'react-native-maps';
import { Marker } from 'react-native-maps'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

class PageAscreen extends React.Component {
    constructor(){
        super() 
            this.state = {
                currentPosition: { latitude: 0, longitude: 0 }, errorMessage: null, logPosition: [],
                displayHistorique: true
            };
        
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
        let location = await Location.getCurrentPositionAsync({});
        if (location.coords.latitude != 0 && location.coords.longitude != 0) {
            var logPositionCopy = [...this.state.logPosition];
            logPositionCopy.push({ latitude: location.coords.latitude, longitude: location.coords.longitude })
            this.setState({ logPosition: logPositionCopy });
         fetch('https://locapic-lacapsule2020.herokuapp.com/logPosition/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'facebookid=' + this.props.user.userId + '&latitude=' + location.coords.latitude + '&longitude=' + location.coords.longitude,
        })
        }

         this.setState({
            currentPosition: { latitude: location.coords.latitude, longitude: location.coords.longitude }
        });
            

        fetch('https://locapic-lacapsule2020.herokuapp.com/logPosition?facebookid=' + this.props.user.userId)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.setState({
                    logPosition: data.historiquePosition
                })
            })
    };
    render() {
        
        if (this.state.displayHistorique) {
            var makerList = this.state.logPosition.map((marker, i) => {
                return ( <Marker
                    key={i}
                    image={require('../../assets/pin2.png')}
                    title="Yoann"
                    description="Président"
                    draggable
                    coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude
                    }}
                    />)
            })
        }
        return (
        
        <View style={styles.container}>
                <Header
                    statusBarProps={{ barStyle: 'light-content' }}
                    barStyle="light-content"
                    leftComponent={<Button icon={
                        <Icon
                            name="power-off"
                            size={17}
                            color="white"
                        />
                    }
                        type="clear"
                        titleStyle={{ color: "#fff" }}
                        onPress={() => AsyncStorage.clear()} />}
                    rightComponent={<Button icon={
                        <Icon
                            name="street-view"
                            size={17}
                            color="white"
                        />
                    }
                        type="clear"
                        titleStyle={{ color: "#fff" }}
                        onPress={() => this.setState({ displayHistorique: !this.state.displayHistorique })} />}
                    centerComponent={{ text: 'LocaPic - Map', style: { color: '#fff', fontSize: 20, fontWeight: "bold" } }}
                    containerStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'space-around',
                        borderBottomColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                />
                <View style={styles.texte}>
                    
                    <Avatar
                        containerStyle={styles.Avatar}
                        size={100}
                        rounded
                        source={{
                            uri: decodeURIComponent(this.props.user.picture),
                        }}
                    />


                    <Text style={styles.Hello}>Bonjour</Text>


                    <Text style={styles.Name}>{this.props.user.firstName}</Text>
                </View>  
               
                <View style={styles.featured}>

                    <Tile imageSrc={require('../../assets/lfc.jpg')} featured />

                </View >  
                <View style={styles.picture}>
                    <Text style={styles.Hello}>Bonjour</Text>
                </View > 
                <MapView
                    style={{
                        flex: 1, 
                        marginTop: -50, 
                        borderWidth: 1,
                        backgroundColor: '#000',
                        alignContent: 'center',
                    }}
                    provider={PROVIDER_GOOGLE}
                    customMapStyle={RetroMapStyles}
                    region={{
                        latitude: this.state.currentPosition.latitude,
                        longitude: this.state.currentPosition.longitude,
                        latitudeDelta: 0.1922,
                        longitudeDelta: 0.1421
                    }}
                    // showsUserLocation={true}   
                >
                    {makerList}
                    
                    
                </MapView> 
                
                     
        </View>);
    }
}


function mapStateToProps(state) {
    console.log('state ===== ', state)
    return { user: state.user }
}

export default connect(mapStateToProps, null)(PageAscreen);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        
        justifyContent: 'center',
    },

    featured: {
        marginTop: -320,
        zIndex: -10,
        justifyContent: 'center',
    },
    picture: {
        alignItems: 'center',
        width:'100%',
        marginTop: -20,
        borderRadius: 30,
        borderColor: "#fff",
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    texte: {
        
        height:220,
        width:'100%',
        backgroundColor: 'rgba(95, 60, 209, 0)',
        alignItems: 'center',
    },
    Hello: {
        marginTop:20,
        color:'#fff',
        fontSize: 20,
        alignItems: 'center',
    },
    Name: {
        color: '#fff',
        fontSize: 30,
        fontWeight:'bold',
        alignItems: 'center',
    },

    Avatar: {
        marginTop: 20,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOpacity: 1,
        borderRadius: 100,
        borderColor: "#fff",
        borderWidth: 4,
        elevation: 20,
        shadowRadius: 10,
        shadowOffset: {
            width: 1,
            height: 1
        }
    },
});