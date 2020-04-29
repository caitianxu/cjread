import React from 'react';
import {Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BookRack from '../BookRack';
import Index from '../Index';
import Me from '../Me';

const Tab = createBottomTabNavigator();
class Page extends React.Component {
  render() {
    return (
      <Tab.Navigator
        initialRouteName="BarMain"
        tabBarOptions={{
          inactiveTintColor: '#aaaaaa',
          activeTintColor: '#fd6655',
        }}>
        <Tab.Screen
          name="BarRack"
          component={BookRack}
          options={{
            tabBarLabel: '列表',
            tabBarIcon: ({focused}) => (
              <Image
                source={
                  focused
                    ? require('../../assets/img/rack-at.png')
                    : require('../../assets/img/rack.png')
                }
                style={{width: 26, height: 26}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="BarMain"
          component={Index}
          options={{
            tabBarLabel: '主页',
            tabBarIcon: ({focused}) => (
              <Image
                source={
                  focused
                    ? require('../../assets/img/home-at.png')
                    : require('../../assets/img/home.png')
                }
                style={{width: 24, height: 24}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="BarMe"
          component={Me}
          options={{
            tabBarLabel: '我的',
            tabBarIcon: ({focused}) => (
              <Image
                source={
                  focused
                    ? require('../../assets/img/me-at.png')
                    : require('../../assets/img/me.png')
                }
                style={{width: 26, height: 26}}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}
export default Page;
