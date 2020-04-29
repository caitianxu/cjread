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
import AntDesign from 'react-native-vector-icons/AntDesign';

function Feed() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Feed!</Text>
      <AntDesign name="book" />
    </View>
  );
}

function Profile() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Profile!</Text>
    </View>
  );
}

function Notifications() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Notifications!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      tabBarOptions={{
        activeTintColor: '#e91e63',
      }}>
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <AntDesign name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: 'Updates',
          tabBarIcon: ({color, size}) => (
            <AntDesign name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <AntDesign name="book" size={size} color={color} />
          ),
        }}
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
