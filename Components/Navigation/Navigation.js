import React from 'react';
import { Platform } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';


import HomeScreen from '../Screens/HomeScreen';
import PageAscreen from '../Screens/PageA';
import PageBscreen from '../Screens/PageB';


const MainNavigator = createBottomTabNavigator({
    Map: PageAscreen,
    Message: PageBscreen,
}, {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                var iconName;
                var outline = (focused)
                    ? ''
                    : '';
                if (navigation.state.routeName == 'Map') {
                    Platform.OS === 'ios'
                        ? iconName = 'ios-compass'
                        : iconName = 'md-compass'
                } else if (navigation.state.routeName == 'Message') {
                    Platform.OS === 'ios'
                        ? iconName = 'ios-chatboxes'
                        : iconName = 'md-chatboxes'
                } 

                return <Ionicons name={iconName + outline} size={25} color={tintColor} />;
            }
        }),
        tabBarOptions: {
            activeTintColor: '#000',
            inactiveTintColor: '#bbb'
        }
    });

const StackNavigator = createStackNavigator({
    
    Home: HomeScreen,
 
    MainNavigator: MainNavigator
}, { headerMode: 'none' })

export default Navigation = createAppContainer(StackNavigator);
