import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import store from '../../script/store';
import Util from '../../script/util';
import Icons from 'react-native-vector-icons/AntDesign';
import {withNavigationFocus} from 'react-navigation';
import HTTP from '../../script/request';
import {_clear_store_all} from '../../script/action';

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: width * 0.45 + 80,
    backgroundColor: '#f4f4f4',
  },
  headerBg: {
    width: width,
    height: width * 0.45,
  },
  headerContent: {
    position: 'absolute',
    width: width - 40,
    height: width * 0.42,
    backgroundColor: '#fff',
    bottom: 20,
    left: 20,
    elevation: 2,
    paddingTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
  },
  cover: {
    width: 66,
    height: 66,
    borderRadius: 33,
    position: 'absolute',
    backgroundColor: '#eee',
    top: -33,
    left: (width - 40) / 2 - 33,
  },
  nick: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  sign: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    paddingTop: 5,
    marginBottom: 30,
  },
  detail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    width: (width - 40) / 5,
  },
  number: {
    textAlign: 'center',
    color: '#000',
  },
  nname: {
    textAlign: 'center',
    fontSize: 12,
  },
  viewRow: {
    flexDirection: 'row',
    paddingLeft: 15,
  },
  viewLeft: {
    paddingTop: 15,
  },
  viewRight: {
    marginLeft: 15,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 1,
    paddingBottom: 15,
    paddingTop: 15,
  },
  button: {
    marginTop: 50,
    marginBottom: 30,
    backgroundColor: '#fd6655',
    borderRadius: 5,
    marginLeft: 100,
    marginRight: 100,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
  },
  footerVersion: {
    textAlign: 'center',
    color: '#ddd'
  }
});
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
    };
    store.subscribe(this.storeChange);
  }
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
  _getPageData = () => {
    HTTP.post('/v2/api/member/readCount').then(res => {
      if (res.code === 0) {
        this.setState({...res.data});
      }
    });
  };
  //页面跳转
  _goToPage = (key, param) => {
    this.props.navigation.navigate(key, param);
  };
  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.isFocused && !nextState.base.member) {
      this.props.navigation.navigate('Login');
      return false;
    }
    return true;
  };
  //注销
  _loginup = () => {
    Alert.alert('提示', '你确定退出登录吗?', [
      {text: '取消'},
      {
        text: '确定',
        onPress: () => {
          _clear_store_all().then(() => {
            this.props.navigation.navigate('Home');
          });
        },
      },
    ]);
  };
  render() {
    const {
      member,
      todayTime,
      allTime,
      reviewNum,
      rank,
      version,
    } = this.state.base;
    return (
      <View style={styles.safeAreaView}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/img/bg.png')}
            style={styles.headerBg}
            resizeMode="cover"
          />
          {member ? (
            <View style={styles.headerContent}>
              <Image
                source={{uri: Util.transImgUrl(member.icon)}}
                style={styles.cover}
                resizeMode="cover"
              />
              <Text style={styles.nick}>{member.nick_name}</Text>
              <Text style={styles.sign} numberOfLines={1}>
                {member.sign ? member.sign : '你还没有设置签名'}
              </Text>
              <View style={styles.detail}>
                <View style={styles.col}>
                  <Text style={styles.number} numberOfLines={1}>
                    {todayTime || 0}min
                  </Text>
                  <Text style={styles.nname} numberOfLines={1}>
                    今日已读
                  </Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.number} numberOfLines={1}>
                    {allTime || 0}h
                  </Text>
                  <Text style={styles.nname} numberOfLines={1}>
                    累计时长
                  </Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.number} numberOfLines={1}>
                    {reviewNum || 0}本
                  </Text>
                  <Text style={styles.nname} numberOfLines={1}>
                    已读图书
                  </Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.number} numberOfLines={1}>
                    {rank || '无'}
                  </Text>
                  <Text style={styles.nname} numberOfLines={1}>
                    阅读排名
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>
        <View>
          <View style={styles.viewRow}>
            <Icons name="book" size={20} color="#999" style={styles.viewLeft} />
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.viewRight}
              onPress={this._goToPage.bind(this, 'BookRack', {
                type: 0,
                change: true,
              })}>
              <Text style={styles.viewTitle}>我的书架</Text>
              <Icons name="right" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
          <View style={styles.viewRow}>
            <Icons
              name="customerservice"
              size={20}
              color="#999"
              style={styles.viewLeft}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.viewRight}
              onPress={this._goToPage.bind(this, 'BookRack', {
                type: 1,
                change: true,
              })}>
              <Text style={styles.viewTitle}>听书收藏</Text>
              <Icons name="right" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
          <View style={styles.viewRow}>
            <Icons
              name="videocamera"
              size={20}
              color="#999"
              style={styles.viewLeft}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.viewRight}
              onPress={this._goToPage.bind(this, 'BookRack', {
                type: 2,
                change: true,
              })}>
              <Text style={styles.viewTitle}>视频收藏</Text>
              <Icons name="right" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
          <View style={styles.viewRow}>
            <Icons
              name="message1"
              size={20}
              color="#999"
              style={styles.viewLeft}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.viewRight}
              onPress={this._goToPage.bind(this, 'Reviews')}>
              <Text style={styles.viewTitle}>我的评论</Text>
              <Icons name="right" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
          <View style={styles.viewRow}>
            <Icons
              name="setting"
              size={20}
              color="#999"
              style={styles.viewLeft}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.viewRight}
              onPress={this._goToPage.bind(this, 'Setting')}>
              <Text style={styles.viewTitle}>设置</Text>
              <Icons name="right" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.7} onPress={this._loginup}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>注销</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.footerVersion}>{version}</Text>
      </View>
    );
  }
}

export default withNavigationFocus(Page);
