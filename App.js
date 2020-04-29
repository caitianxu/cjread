import React from 'react';
import {Dimensions, Platform, StatusBar, View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import store from './src/script/store';
import {NavigationContainer, CommonActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {_set_client_info, _getCookie, _member_login} from './src/script/action';
import MyTabs from './src/pages/MyTabs';
import Setting from './src/pages/Setting';
import Search from './src/pages/Search';
import Login from './src/pages/Login';
import Loading from './src/components/Loading';

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
    _getCookie('memberInfo').then((res) => {
      if (res) _member_login(res);
    });
    if (Platform.OS == 'android') {
      //设置状态栏透明
      StatusBar.setTranslucent(true);
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('rgba(0,0,0,0)');
      // Dimensions 用于获取设备宽、高、分辨率
      const {width, height} = Dimensions.get('window');
      //设备资料
      const {Release, Model, Version, Fingerprint} = Platform.constants;
      _set_client_info({
        Release,
        Model,
        Version,
        Fingerprint,
        width,
        height,
        OS: 'android',
      });
    }
  }
  //路由监控
  onStateChange = (state) => {
    if (!this.state.base.member) {
      let name = state.routes[state.index].name;
      if (name == 'Login') return;
      if (name == 'Home') return;
      if (name == 'Books') return;
      if (name == 'Audios') return;
      if (name == 'Videos') return;
      const routes = [{name: 'Home'}];
      this.router.dispatch(
        CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        }),
      );
      this.router.navigate('Login');
    }
  };
  render() {
    const {loading} = this.state.base;
    return (
      <View style={{flex: 1}}>
        <NavigationContainer
          ref={(el) => (this.router = el)}
          onStateChange={this.onStateChange}>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={MyTabs}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Search"
              component={Search}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="Setting" component={Setting} />
            <Stack.Screen name="Login" component={Login} />
          </Stack.Navigator>
        </NavigationContainer>
        <Loading loading={loading} />
      </View>
    );
  }
}

export default App;
