import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Picker,
  ToastAndroid,
} from 'react-native';
import store from '../../script/store';
import Util from '../../script/util';
import Icons from 'react-native-vector-icons/AntDesign';
// import ImagePicker from 'react-native-image-crop-picker';
import {_set_public_loading, _update_member_info} from '../../script/action';
import HTTP from '../../script/request';

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingLeft: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 10,
  },
  name: {
    lineHeight: 30,
    color: '#999',
    width: 80,
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  value: {
    lineHeight: 30,
  },
  valueIcon: {
    paddingTop: 6,
    paddingLeft: 5,
  },
  rightAccount: {
    lineHeight: 30,
    paddingRight: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: 100,
    marginBottom: 30,
    backgroundColor: '#fd6655',
    borderRadius: 5,
    marginLeft: 50,
    marginRight: 65,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
  },
  TextInputLine: {
    flex: 1,
    paddingRight: 10,
    textAlign: 'right',
    height: 30,
    lineHeight: 30,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 5,
    backgroundColor: 'rgba(100,100,100,0.1)',
  },
});

let _that;
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
      nick_name: null,
      icon: null,
      sign: null,
      sex: null,
      member_id: null,
    };
    _that = this;
    store.subscribe(this.storeChange);
  }
  componentDidMount() {
    const {member} = this.state.base;
    if (member) {
      const {nick_name, icon, sign, sex, member_id} = member;
      this.setState({
        nick_name,
        icon,
        sign,
        sex,
        member_id,
      });
    }
  }
  storeChange = () => {
    this.setState({
      base: store.getState(),
    });
  };
  _submit = () => {
    const {nick_name, icon, sign, sex, member_id} = this.state;
    if (!nick_name || nick_name.trim().lemgth == 0) {
      ToastAndroid.showWithGravity(
        '请填写你的昵称!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return false;
    }
    _set_public_loading(true);
    HTTP.post('/v2/api/mobile/memberInfo/updateIcon', {
      icon: icon,
    }).then(res => {
      if (res.code == 0) {
        HTTP.post('/v3/member/updateMemberInfo', {
          sex: sex,
          nickName: nick_name,
          sign: sign,
        }).then(res1 => {
          if (res1.code == 0) {
            ToastAndroid.showWithGravity(
              '资料更新成功!',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
            _update_member_info({
              ...res.data,
              icon: icon,
              sex: sex,
              nick_name: nick_name,
              sign: sign,
            }).then(() => {
              this.props.navigation.navigate('Me');
            });
          } else {
            ToastAndroid.showWithGravity(
              res.message,
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          }
          _set_public_loading(false);
        });
      } else {
        _set_public_loading(false);
        ToastAndroid.showWithGravity(
          res.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    });
  };
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }
  //选择图片
  _showPicker = () => {
    // ImagePicker.openPicker({
    //   width: 300,
    //   height: 300,
    //   cropping: true,
    // }).then(image => {
    //   HTTP.upload({
    //     uri: image.path,
    //   }).then(res => {
    //     if (res.code == 0) {
    //       this.setState({
    //         icon: res.data[0].url,
    //       });
    //     } else {
    //       ToastAndroid.showWithGravity(
    //         res.message,
    //         ToastAndroid.SHORT,
    //         ToastAndroid.CENTER,
    //       );
    //     }
    //   });
    // });
  };
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '设置',
    };
  };
  render() {
    const {nick_name, icon, sign, sex} = this.state;
    return (
      <View style={styles.safeAreaView}>
        <View style={styles.row}>
          <Text style={styles.name}>头像</Text>
          <TouchableOpacity style={styles.right} onPress={this._showPicker}>
            <Image
              source={{uri: Util.transImgUrl(icon)}}
              style={{width: 30, height: 30, borderRadius: 15, marginRight: 10}}
              resizeMode="cover"
            />
            {/* <Icons
              style={styles.valueIcon}
              name="right"
              size={20}
              color="#ccc"
            /> */}
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Text style={styles.name}>性别</Text>
          <View style={styles.right}>
            <Picker
              style={{height: 30, width: 80}}
              selectedValue={sex}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({sex: itemValue})
              }>
              <Picker.Item label="男" value="1" />
              <Picker.Item label="女" value="2" />
            </Picker>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.name}>昵称</Text>
          <View style={styles.rightAccount}>
            <TextInput
              placeholder="你输入昵称"
              maxLength={10}
              value={nick_name}
              onChangeText={text => this.setState({nick_name: text})}
              style={styles.TextInputLine}
            />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.name}>个性签名</Text>
          <View style={styles.rightAccount}>
            <TextInput
              placeholder="你输入个性签名"
              maxLength={16}
              value={sign}
              onChangeText={text => this.setState({sign: text})}
              style={styles.TextInputLine}
            />
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={this._submit}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>保存</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Page;
