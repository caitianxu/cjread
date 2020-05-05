import React from 'react';
import {
  Dimensions,
  Platform,
  View,
  Text,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AppContainer from './src/pages/AppContainer';
import store from './src/script/store';
import {_set_client_info, _getCookie, _member_login} from './src/script/action';

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
    _getCookie('memberInfo').then(res => {
      if (res) _member_login(res);
    });
    //android
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
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }
  render() {
    const {loading} = this.state.base;
    return (
      <View style={{flex: 1}}>
        <AppContainer />
        {loading ? (
          <View style={styles.loading}>
            <View style={styles.loadingBg}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>加载中</Text>
            </View>
          </View>
        ) : null}
      </View>
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
