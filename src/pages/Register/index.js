import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import store from '../../script/store';
import HTTP from '../../script/request';
import {_change_member_info, _set_public_loading} from '../../script/action';

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  row: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
  },
  label: {
    height: 30,
    width: 90,
    lineHeight: 30,
    paddingRight: 30,
  },
  input: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    height: 30,
    lineHeight: 30,
  },
  button: {
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: '#fd6655',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    color: '#999',
    padding: 10,
  },
  bottomText: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
    fontSize: 12,
    color: '#bbb',
    textAlign: 'center',
  },
});
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: null,
      password: null,
      password1: null,
      base: store.getState(),
    };
    store.subscribe(this.storeChange);
  }
  componentDidMount() {}
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
  _changeAccount = text => {
    this.setState({
      account: text,
    });
  };
  _changePassword = text => {
    this.setState({
      password: text,
    });
  };
  _changePassword1 = text => {
    this.setState({
      password1: text,
    });
  };
  _onSubmit = () => {
    const {account, password, password1} = this.state;
    if (!account || account.trim().length < 5) {
      ToastAndroid.showWithGravity(
        '请输入账号，5-15个字符长度.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      this.accountElement.focus();
      return false;
    }
    if (!password || password.trim().length == 0) {
      ToastAndroid.showWithGravity(
        '请输入登录密码!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      this.passwordElement.focus();
      return false;
    }
    if (password != password1) {
      ToastAndroid.showWithGravity(
        '两次密码输入不一致!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      this.passwordElement1.focus();
      return false;
    }
    _set_public_loading(true);
    HTTP.post('/v2/api/mobile/registe', {
      account: account,
      pwd: password,
    }).then(res => {
      if (res.code == 0) {
        ToastAndroid.showWithGravity(
          '恭喜，账号注册成功',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        this.props.navigation.goBack();
      } else {
        ToastAndroid.showWithGravity(
          res.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
      _set_public_loading(false);
    });
  };
  render() {
    return (
      <View style={styles.safeAreaView}>
        <View style={styles.row}>
          <Text style={styles.label}>账号</Text>
          <TextInput
            placeholder={'请输入账号'}
            style={styles.input}
            selectionColor={'#fd6655'}
            value={this.state.account}
            maxLength={15}
            onChangeText={this._changeAccount}
            ref={el => (this.accountElement = el)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>密码</Text>
          <TextInput
            placeholder={'请输入密码'}
            style={styles.input}
            secureTextEntry={true}
            selectionColor={'#fd6655'}
            value={this.state.password}
            maxLength={16}
            onChangeText={this._changePassword}
            ref={el => (this.passwordElement = el)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>确认密码</Text>
          <TextInput
            placeholder={'请输入密码'}
            style={styles.input}
            secureTextEntry={true}
            selectionColor={'#fd6655'}
            value={this.state.password1}
            maxLength={16}
            onChangeText={this._changePassword1}
            ref={el => (this.passwordElement1 = el)}
          />
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={this._onSubmit}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>立即注册</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.bottomText}>
          2017-2027 @ All Rights Reservd By 微悦读
        </Text>
      </View>
    );
  }
}

export default Page;
