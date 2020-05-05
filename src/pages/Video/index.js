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
const ImageWH = (width - 40) / 2; //图书
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: width,
    backgroundColor: '#fff',
  },
  maxCover: {
    width: width,
    height: width * 0.6,
    backgroundColor: '#eee',
    position: 'relative',
  },
  coverImg: {
    width: width,
    height: width * 0.6,
  },
  videoRemark: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  actions: {
    backgroundColor: '#fff',
    padding: 5,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  action1: {
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center',
  },
  action2: {
    color: '#ccc',
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center',
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
  col2: {
    width: ImageWH,
    marginTop: 10,
    alignItems: 'center',
  },
  bookCover: {
    width: ImageWH,
    height: ImageWH * 0.6,
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
  playBg: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoRemarks: {},
});
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
      video: null,
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
      type: 1,
      media_id: param.video_id,
    }).then(res => {
      if (res.code == 0 && res.data) {
        this.setState({
          video: {
            ...param,
            shelf_id: 1,
          },
        });
      } else {
        this.setState({
          video: {
            ...param,
          },
        });
      }
    });
  };
  //推荐
  _getTuijian = () => {
    HTTP.post('/api/hbjt/getvideos').then(res => {
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
    let {video} = this.state;
    HTTP.post('/api/hbjt/addcollect', {
      type: 1,
      media_id: video.video_id,
    }).then(res => {
      if (video.shelf_id) {
        video.shelf_id = null;
        ToastAndroid.showWithGravity(
          '取消收藏成功!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else {
        video.shelf_id = 1;
        ToastAndroid.showWithGravity(
          '收藏成功!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
      this.setState({
        video: {...video},
      });
    });
  };
  //去播放
  _toPlay = () => {
    this.props.navigation.navigate('VideoPlay', {
      title: this.state.video.video_title,
      uri: this.state.video.video_url,
    });
  };
  render() {
    const {video, tuijian} = this.state;
    return (
      <ScrollView style={styles.container} ref={el => (this.myScroll = el)}>
        {video ? (
          <View>
            <View style={styles.header}>
              <View style={styles.maxCover}>
                <Image
                  source={{uri: Util.transImgUrl(video.cover_url_small)}}
                  style={styles.coverImg}
                />
                <TouchableOpacity style={styles.playBg} onPress={this._toPlay}>
                  <AntDesign
                    name="playcircleo"
                    size={40}
                    color="#fff"
                    style={styles.playcircleo}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={this._changeShelf}>
                  {video.shelf_id ? (
                    <Text style={styles.action2}>取消收藏</Text>
                  ) : (
                    <Text style={styles.action1}>加入收藏</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.comPlan}>
              <View style={styles.titleRow}>
                <Text style={styles.titleName}>视频简介</Text>
              </View>
              <Text style={styles.videoRemarks}>{video.video_remark}</Text>
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
                      onPress={this._goToPage.bind(this, 'Video', {...item})}>
                      <View style={styles.col2}>
                        <Image
                          style={styles.bookCover}
                          source={{
                            uri: Util.transImgUrl(item.cover_url_small),
                          }}
                        />
                        <Text style={styles.bookName1} numberOfLines={1}>
                          {item.video_title}
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
