import React from 'react';
import { StyleSheet, ImageBackground, View, AsyncStorage, Text } from 'react-native';
import { SocialIcon, Avatar, Button } from 'react-native-elements'
import { AuthSession } from 'expo';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

class HomeScreen extends React.Component {
    
    componentDidMount = () => {

        AsyncStorage.getItem("user", (error, data) => {
            var userData = JSON.parse(data);

            console.log("userData=======", userData);
            this.props.signin(userData)
        })
    }
    _handlePressAsync = async () => {
        var redirectUrl = AuthSession.getRedirectUrl(
        );

        var result = await AuthSession.startAsync({
            authUrl:
                'https://locapic-lacapsule2020.herokuapp.com/auth/facebook?redirectUrl=' + redirectUrl
        });
        console.log("Retour de Facebook --> ", result);
        if (result.type === 'success') {
            this.props.signin(result.params)
            AsyncStorage.setItem("user", JSON.stringify(
                result.params
            ))
            
            console.log("result.params", result.params);
 
            this.props.navigation.navigate('Map');
        }
    }
    render() {
       
            return (
                
                
                <ImageBackground style={{ flex: 1 }} source={require("../../assets/bg.png")}>
                    {
                        (this.props.user) ?
                            <View style={styles.container}>
                                <Avatar
                                    containerStyle={styles.Avatar}
                                    size={100}
                                    rounded
                                    source={{
                                        uri: decodeURIComponent(this.props.user.picture),
                                    }}
                                />


                                <Text style={styles.Hello}>Welcome back</Text>


                                <Text style={styles.Name}>{this.props.user.firstName}</Text>
                                <Button
                                    buttonStyle={{ backgroundColor: "#000", }}
                                    icon={
                                        <Icon
                                            name="arrow-right"
                                            size={15}
                                            color="white"
                                        />
                                    }
                                    title=" Continuer"
                                    type="outline"
                                    titleStyle={{ color: '#fff' }}
                                    onPress={() => this.props.navigation.navigate('Map')}
                                />

                            </View>
                   
                            : <View style={styles.container}>
                                <SocialIcon
                                    style={{ width: '70%' }}
                                    title='Sign In With Facebook'
                                    button
                                    type='facebook'
                                    onPress={this._handlePressAsync}
                                />
                            </View>
                    }
                </ImageBackground>
                    
            )
        }

}


function mapDispatchToProps(dispatch) {
    return {
        signin: function (user) {
            dispatch({ type: 'signin', user,  })
        },

    }
}
function mapStateToProps(state) {
    console.log('state ===== ', state)
    return { user: state.user }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Hello: {
        marginTop: 20,
        color: '#000',
        fontSize: 20,
        alignItems: 'center',
    },
    Name: {
        color: '#000',
        fontSize: 30,
        marginBottom: 20,
        fontWeight: 'bold',
        alignItems: 'center',
    },

    Avatar: {
        marginTop: 0,
        
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