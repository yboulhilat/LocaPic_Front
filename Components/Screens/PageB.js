import React from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Text} from 'react-native';
import {connect} from 'react-redux';
import {Header, Input, Button, ListItem} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import socketIOClient from "socket.io-client";
import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
])

class PageBscreen extends React.Component {
  constructor() {
    super()
    this.state = {
      messageToSend: '',
      messageList: []
    }

  }
  // onChangeValue = (value) => {   this.setState({     messageToSend: value,
  // }); }
  componentDidMount() {
    this.socket = socketIOClient("https://locapic-lacapsule2020.herokuapp.com/");

    this
      .socket
      .on('sendMessage', (message) => {
        console.log(message);
        var messageListCopy = [...this.state.messageList];
        messageListCopy.push({
          message: this.state.messageToSend,
          user: this.props.user.firstName,
          picture: decodeURIComponent(this.props.user.picture)
        })
        this.setState({messageList: messageListCopy, messageToSend: ''});
      });
  }

  render() {
    var messageList = this
      .state
      .messageList
      .map((message, i) => {
        return (<ListItem
          key={i}
          leftAvatar={{
          source: {
            uri: message.picture
          }
        }}
          title={message.user}
          subtitle={message.message}/>)
      })
    return (
      <View style={{
        flex: 1
      }}>
        <Header
          statusBarProps={{
          barStyle: 'light-content'
        }}
          barStyle="light-content"
          centerComponent={{
          text: 'LocaPic - Message',
          style: {
            color: '#fff',
            fontSize: 20,
            fontWeight: "bold"
          }
        }}
          containerStyle={{
          backgroundColor: 'rgba(0, 0, 0, 1)',
          justifyContent: 'space-around',
          borderBottomColor: 'rgba(0, 0, 0, 0.5)'
        }}/>
        <ScrollView style={styles.List}>

          {messageList}

        </ScrollView >
        <KeyboardAvoidingView style={styles.Input} behavior="padding" enabled>
          <Input
            style={{
            width: '100%',
            borderBottomColor: '#fff',
            borderBottomWidth: 1
          }}
            placeholder='Saisissz un message'
            rightIcon={< Button style = {{ backgroundColor: '#000', borderRadius: 3, borderColor: "#000", borderWidth: 1, color: '#fff' }}icon = { < Icon name = "paper-plane" size = {
              15
            }
            color = "#fff" />
          }
          type = "clear" onPress = {
            () => this
              .socket
              .emit("sendMessage", {
                message: this.state.messageToSend,
                user: this.props.user.firstName
              })
          } />}
            leftIcon={< Icon style = {{marginRight:10}}name = 'paperclip' size = {
            24
          }
          color = 'black' />}
            value={this.state.messageToSend}
            onChangeText={(message) => this.setState({messageToSend: message})}/>

        </KeyboardAvoidingView>

      </View>
    );
  }
}

function mapStateToProps(state) {
  console.log('Page B =======', state)
  return {user: state.user}
}

export default connect(mapStateToProps, null)(PageBscreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 1)'
  },
  Input: {

    width: '100%'
  },
  List: {
    backgroundColor: '#eee',
    width: '100%'
  }
});