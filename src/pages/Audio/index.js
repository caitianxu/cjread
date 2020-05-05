import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import store from '../../script/store';
import HTTP from '../../script/request';
import Util from '../../script/util';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {_set_public_loading} from '../../script/action';

const {width, height} = Dimensions.get('window');
const ImageWH = (width - 50) / 3; //图书
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: width,
    backgroundColor: '#fff',
  },
  maxCover: {
    width: width * 0.3,
    height: width * 0.5 - 30,
    backgroundColor: '#eee',
    marginLeft: width * 0.35,
    elevation: 10,
    marginTop: 15,
    marginBottom: 15,
  },
  coverImg: {
    width: width * 0.3,
    height: width * 0.5 - 30,
  },
  audioRemark: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  actions: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  action1: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: width * 0.15,
    paddingRight: width * 0.15,
  },
  action2: {
    color: '#ccc',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: width * 0.15,
    paddingRight: width * 0.15,
  },
  action3: {
    transform: [{rotate: '90deg'}],
  },
  comPlan: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    borderTopColor: '#eee',
    borderTopWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleName: {
    color: '#333',
  },
  tuijians: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  col3: {
    width: ImageWH,
    marginTop: 10,
    alignItems: 'center',
  },
  bookCover: {
    width: ImageWH,
    height: ImageWH * 1.4,
    borderRadius: 2,
    backgroundColor: '#eee',
  },
  bookName1: {
    fontSize: 12,
    paddingTop: 5,
  },
  footerCopy: {
    backgroundColor: '#fff',
    textAlign: 'center',
    paddingTop: 30,
    paddingBottom: 30,
    marginTop: 15,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    fontSize: 12,
    color: '#999',
  },
});
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
      audio: null,
      tuijian: [],
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
  componentDidMount() {
    this._isChcollect(this.props.navigation.state.params);
    this._getTuijian();
  }
  //是否收藏
  _isChcollect = param => {
    HTTP.post('/api/hbjt/searchcollect', {
      type: 2,
      media_id: param.audio_id,
    }).then(res => {
      if (res.code == 0 && res.data) {
        this.setState({
          audio: {
            ...param,
            shelf_id: 1,
          },
        });
      } else {
        this.setState({
          audio: {
            ...param,
          },
        });
      }
    });
  };
  //推荐
  _getTuijian = () => {
    HTTP.post('/api/hbjt/getaudios').then(res => {
      if (res.code == 0) {
        this.setState({
          tuijian: res.data.rows,
        });
      }
    });
  };
  //页面跳转
  _goToPage = (key, param) => {
    this.props.navigation.setParams(param);
    this._isChcollect(param);
    this.myScroll.scrollTo({x: 0, y: 0, animated: true});
  };
  //收藏
  _changeShelf = () => {
    let {audio} = this.state;
    HTTP.post('/api/hbjt/addcollect', {
      type: 2,
      media_id: audio.audio_id,
    }).then(res => {
      if (audio.shelf_id) {
        audio.shelf_id = null;
        ToastAndroid.showWithGravity(
          '取消收藏成功!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else {
        audio.shelf_id = 1;
        ToastAndroid.showWithGravity(
          '收藏成功!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
      this.setState({
        audio: {...audio},
      });
    });
  };
  //收听
  _toPlay = () => {
    this.props.navigation.navigate('AudioPlay', {...this.state.audio});
  };
  render() {
    const {audio, tuijian} = this.state;
    return (
      <ScrollView style={styles.container} ref={el => (this.myScroll = el)}>
        {audio ? (
          <View>
            <View style={styles.header}>
              <View style={styles.maxCover}>
                <Image
                  source={{uri: Util.transImgUrl(audio.cover_url_small)}}
                  style={styles.coverImg}
                />
              </View>
              <Text style={styles.audioRemark}>{audio.audio_remark}</Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={this._changeShelf}>
                  {audio.shelf_id ? (
                    <Text style={styles.action2}>取消收藏</Text>
                  ) : (
                    <Text style={styles.action1}>加入收藏</Text>
                  )}
                </TouchableOpacity>
                <AntDesign
                  name="minus"
                  size={20}
                  color="#ddd"
                  style={styles.action3}
                />
                <TouchableOpacity onPress={this._toPlay}>
                  <Text style={styles.action1}>立即收听</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.comPlan}>
              <View style={styles.titleRow}>
                <Text style={styles.titleName}>相关推荐</Text>
              </View>
              <View style={styles.tuijians}>
                {tuijian.map((item, index) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      key={`book-${index}`}
                      onPress={this._goToPage.bind(this, 'Audio', {...item})}>
                      <View style={styles.col3}>
                        <Image
                          style={styles.bookCover}
                          source={{
                            uri: Util.transImgUrl(item.cover_url_small),
                          }}
                        />
                        <Text style={styles.bookName1} numberOfLines={1}>
                          {item.audio_title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <Text style={styles.footerCopy}>
              2017-2027 @ All Rights Reservd By 微悦读
            </Text>
          </View>
        ) : null}
      </ScrollView>
    );
  }
}

export default Page;
