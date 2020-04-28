import React from 'react';
import {
    createAppContainer
} from 'react-navigation';
import {
    createBottomTabNavigator
} from 'react-navigation-tabs';
import {
    createStackNavigator
} from 'react-navigation-stack';
import {
    View,
    Image
} from 'react-native';

import page1 from './pages/page1'
import page2 from './pages/page2'
import page3 from './pages/page3'

const TabNavigator = createBottomTabNavigator({
    page1: {
        screen: page1,
    },
    page2: {
        screen: page2,
    },
    page3: {
        screen: page3,
    }
}, {
    initialRouteName: 'page1',
    tabBarOptions: {
        inactiveTintColor: '#aaaaaa',
        activeTintColor: '#fd6655',
    },
});

export default createAppContainer(TabNavigator);