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
import AntDesign from 'react-native-vector-icons/AntDesign';
function HomeScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator();
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
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'My home',
              headerStyle: {
                backgroundColor: '#f4511e',
              },
              headerTintColor: '#fff',
            }}
          />
        </Stack.Navigator>
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
