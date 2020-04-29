import React from 'react';
import {
  Dimensions,
  Platform,
  View,
  StatusBar,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import store from './src/script/store';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';

function FeedScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Feed!</Text>
    </View>
  );
}

function NotificationsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications!</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile!</Text>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      tabBarOptions={{
        activeTintColor: '#e91e63',
        labelStyle: { fontSize: 12 },
        style: { backgroundColor: 'powderblue' },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ tabBarLabel: 'Updates' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
    };
    store.subscribe(this.storeChange);
  }
  //更新store
  storeChange = () => {
    this.setState({
      base: store.getState(),
    });
  };
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }
  componentDidMount() {
    setTimeout(SplashScreen.hide, 500);
    if (Platform.OS == 'android') {
      //设置状态栏透明
      StatusBar.setTranslucent(true);
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('rgba(0,0,0,0)');
      // Dimensions 用于获取设备宽、高、分辨率
      const {width, height} = Dimensions.get('window');
      //设备资料
      const {Release, Model, Version, Fingerprint} = Platform.constants;
    }
  }
  render() {
    const {loading} = this.state.base;
    return (
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1001,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBg: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    width: 120,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 10,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
    paddingTop: 10,
  },
});

export default App;
