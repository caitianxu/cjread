import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  ScrollView,
  Image,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import store from '../../script/store';
import HTTP from '../../script/request';
import Util from '../../script/util';
import {withNavigationFocus} from 'react-navigation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ScrollableTabView, {
  DefaultTabBar,
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';

const {width, height} = Dimensions.get('window');
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
      page: 0,
      books: null,
      videos: null,
      audios: null,
      edit: false, //编辑
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
    this._getPageData(0);
  }
  //变更检查
  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.isFocused && !nextState.base.member) {
      this.props.navigation.navigate('Login');
      return false;
    }
    //只有外部参数才执行
    if (nextProps.isFocused && this.props.navigation.state.params) {
      const {change, type} = this.props.navigation.state.params;
      if (change) {
        this.props.navigation.state.params.change = false;
        if (this.myTabView) this.myTabView.goToPage(type);
      }
    }
    return true;
  };
  //获取内容
  _getPageData = i => {
    if (i == 1) {
      this.getAudioData();
    } else if (i == 2) {
      this.getVideoData();
    } else {
      this.getBookData();
    }
  };
  //图书
  getBookData = () => {
    HTTP.post('/v2/api/bookShelf/getList').then(res => {
      if (res.code == 0 && res.data && res.data.length > 0) {
        this.setState({
          books: [...res.data],
        });
      }
    });
  };
  //听书
  getAudioData = () => {
    HTTP.post('/api/hbjt/getcollectlist', {
      type: 2,
      pageNum: 1,
      pageSize: 100,
    }).then(res => {
      if (res.code == 0 && res.data && res.data.rows.length > 0) {
        this.setState({
          audios: [...res.data.rows],
        });
      }
    });
  };
  //视频
  getVideoData = () => {
    HTTP.post('/api/hbjt/getcollectlist', {
      type: 1,
      pageNum: 1,
      pageSize: 100,
    }).then(res => {
      if (res.code == 0 && res.data && res.data.rows.length > 0) {
        this.setState({
          videos: [...res.data.rows],
        });
      }
    });
  };
  //页面跳转
  _goToPage = (key, param) => {
    if (this.state.edit) {
      this._changeEdit();
      return;
    }
    this.props.navigation.navigate(key, param);
  };
  _changeEdit = () => {
    this.setState({
      edit: !this.state.edit,
    });
  };
  //删除图书收藏
  _delBook = item => {
    HTTP.post('/v2/api/bookShelf/delBook', {
      book_id: item.bk_id,
    }).then(res => {
      if (res.code == 0) {
        ToastAndroid.showWithGravity(
          '移除成功!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        this.getBookData();
      }
    });
  };
  //删除听书收藏
  _delAudio = item => {
    HTTP.post('/api/hbjt/addcollect', {
      type: 2,
      media_id: item.audio_id,
    }).then(res => {
      if (res.code == 0) {
        ToastAndroid.showWithGravity(
          '移除成功!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        this.getAudioData();
      }
    });
  };
  //删除听书收藏
  _delVideo = item => {
    HTTP.post('/api/hbjt/addcollect', {
      type: 1,
      media_id: item.video_id,
    }).then(res => {
      if (res.code == 0) {
        ToastAndroid.showWithGravity(
          '移除成功!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        this.getVideoData();
      }
    });
  };
  render() {
    const {books, videos, audios} = this.state;
    return (
      <ScrollableTabView
        ref={el => (this.myTabView = el)}
        style={{marginTop: 25}}
        // 默认选中tab
        initialPage={0}
        // tab位置
        tabBarPosition="top"
        // 切换回调
        onChangeTab={target => {
          if (target.i != target.from) {
            this._getPageData(target.i);
          }
        }}
        //文字颜色
        tabBarActiveTextColor="#fd6655"
        //未选中文字颜色
        tabBarInactiveTextColor="#999"
        //下划线的样式
        tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
        //文本样式
        tabBarTextStyle={styles.tabBarTextStyle}
        renderTabBar={() => <DefaultTabBar />}>
        <ScrollView tabLabel="图书">
          {books ? (
            <View style={styles.flexPlan}>
              {books.map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    key={`book-${index}`}
                    onLongPress={this._changeEdit}
                    onPress={this._goToPage.bind(this, 'Reader', {
                      bookid: item.bk_id,
                      bookname: item.bk_name,
                    })}>
                    <View style={styles.col3}>
                      <Image
                        style={styles.bookCover}
                        source={{
                          uri: Util.transImgUrl(item.bk_cover_small),
                        }}
                      />
                      {/* 长按删除 */}
                      {this.state.edit ? (
                        <TouchableWithoutFeedback
                          onPress={this._delBook.bind(this, item)}>
                          <AntDesign
                            name="closecircle"
                            size={24}
                            color="#fd6655"
                            style={styles.delete}
                          />
                        </TouchableWithoutFeedback>
                      ) : null}
                      <Text style={styles.bookName} numberOfLines={1}>
                        {item.bk_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.notData}>
              <Image
                source={require('../../assets/img/not.png')}
                style={styles.notImage}
              />
              <Text style={{color: '#999'}}>还没有内容</Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={this._goToPage.bind(this, 'Books')}>
                <Text style={{color: '#fd6655'}}>立即添加</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
        <ScrollView tabLabel="听书">
          {audios ? (
            <View style={styles.flexPlan}>
              {audios.map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    key={`audio-${index}`}
                    onLongPress={this._changeEdit}
                    onPress={this._goToPage.bind(this, 'AudioPlay', {...item})}>
                    <View style={styles.col3}>
                      <Image
                        style={styles.bookCover}
                        source={{
                          uri: Util.transImgUrl(item.cover_url_small),
                        }}
                      />
                      {/* 长按删除 */}
                      {this.state.edit ? (
                        <TouchableWithoutFeedback
                          onPress={this._delAudio.bind(this, item)}>
                          <AntDesign
                            name="closecircle"
                            size={24}
                            color="#fd6655"
                            style={styles.delete}
                          />
                        </TouchableWithoutFeedback>
                      ) : null}
                      <Text style={styles.bookName} numberOfLines={1}>
                        {item.audio_title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.notData}>
              <Image
                source={require('../../assets/img/not.png')}
                style={styles.notImage}
              />
              <Text style={{color: '#999'}}>还没有内容</Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={this._goToPage.bind(this, 'Audios')}>
                <Text style={{color: '#fd6655'}}>立即添加</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
        <ScrollView tabLabel="视频">
          {videos ? (
            <View style={styles.flexPlan}>
              {videos.map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    key={`audio-${index}`}
                    onLongPress={this._changeEdit}
                    onPress={this._goToPage.bind(this, 'VideoPlay', {
                      title: item.video_title,
                      uri: item.video_url,
                    })}>
                    <View style={styles.col2}>
                      <Image
                        style={styles.videoCover}
                        source={{
                          uri: Util.transImgUrl(item.cover_url_small),
                        }}
                      />
                      {/* 长按删除 */}
                      {this.state.edit ? (
                        <TouchableWithoutFeedback
                          onPress={this._delVideo.bind(this, item)}>
                          <AntDesign
                            name="closecircle"
                            size={24}
                            color="#fd6655"
                            style={styles.delete}
                          />
                        </TouchableWithoutFeedback>
                      ) : null}
                      <Text style={styles.bookName} numberOfLines={1}>
                        {item.video_title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.notData}>
              <Image
                source={require('../../assets/img/not.png')}
                style={styles.notImage}
              />
              <Text style={{color: '#999'}}>还没有内容</Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={this._goToPage.bind(this, 'Videos')}>
                <Text style={{color: '#fd6655'}}>立即添加</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </ScrollableTabView>
    );
  }
}
const ImageWH = (width - 40) / 3; //图书
const ImageVH = (width - 30) / 2; //图书
const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBEBEB',
    flex: 1,
    paddingTop: 20,
  },
  tabBarUnderlineStyle: {
    backgroundColor: '#fd6655',
    borderRadius: 2,
    width: (width - 150) / 3,
    marginLeft: 25,
  },
  tabBarTextStyle: {
    fontSize: 18,
  },
  notData: {
    paddingTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notImage: {
    width: 200,
    height: 200,
  },
  addBtn: {
    marginTop: 20,
    borderRadius: 5,
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: '#fd6655',
  },
  flexPlan: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 10,
  },
  col3: {
    width: ImageWH,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    alignItems: 'center',
    position: 'relative',
  },
  bookCover: {
    width: ImageWH,
    height: ImageWH * 1.4,
    borderRadius: 3,
    backgroundColor: '#eee',
  },
  bookName: {
    fontSize: 12,
    paddingTop: 5,
  },
  col2: {
    width: ImageVH,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    alignItems: 'center',
    position: 'relative',
  },
  videoCover: {
    width: ImageVH,
    height: ImageVH * 0.6,
    borderRadius: 3,
    backgroundColor: '#eee',
  },
  delete: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 30,
    top: 2,
    right: 2,
    margin: 2,
  },
});
export default withNavigationFocus(Page);
