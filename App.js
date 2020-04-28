
import React from 'react';
import {
  View,
  Text,
  StatusBar,
  Modal,
  Button
} from 'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import SplashScreen from 'react-native-splash-screen'
import AppContainer from './src/AppContainer'
import store from './src/script/store'
import { _hide_modal } from './src/script/action'

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
    }, () => {
      console.log('公共数据变更', this.state.base)
    });
  };
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }
  componentDidMount() {
    SplashScreen.hide();
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppContainer />
        {/* 公共组件 */}
        <Modal animationType="slide"
          transparent={false}
          visible={this.state.base.modal_version}>
          <View style={{ backgroundColor: '#f90', flex: 1, justifyContent: 'space-between' }}>
            <Text> this is modal content </Text>
            <View>
              <Button title='关闭Modal' onPress={_hide_modal} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
};

export default App;
