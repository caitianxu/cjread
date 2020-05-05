import React from 'react';
import {
  Text,
  View,
  ScrollView,
  StatusBar,
  FlatList,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ToastAndroid,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Slider from '@react-native-community/slider';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import HTML from 'react-native-render-html';
import store from '../../script/store';
import HTTP from '../../script/request';
import {_getCookie, _setCookie} from '../../script/action';

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  containerParent: {
    flex: 1,
    paddingTop: 30,
    position: 'relative',
  },
  container: {
    flex: 1,
  },
  rowLine: {
    elevation: 2,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginBottom: 10,
    marginTop: 10,
  },
  footer: {
    alignItems: 'center',
    paddingRight: 15,
    marginTop: 50,
    marginBottom: 30,
  },
  bookChapter: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  headerControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    zIndex: 1002,
    paddingTop: 20,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 10,
  },
  goBack: {
    padding: 10,
  },
  goBack1: {
    paddingTop: 10,
    paddingRight: 15,
    paddingBottom: 10,
  },
  videoTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    paddingRight: 10,
  },
  footerControl: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width,
    zIndex: 1002,
    paddingTop: 20,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 10,
  },
  control: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 25,
    paddingLeft: 10,
    paddingRight: 10,
  },
  changeText: {
    color: '#fff',
  },
  controls: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
  },
  colors: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  color: {
    width: 30,
    height: 30,
    borderRadius: 5,
    borderWidth: 2,
  },
  actionItem: {
    color: '#fff',
    fontSize: 10,
    paddingTop: 5,
  },
  controlItem: {
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  leftMenu: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    width: width * 0.65,
    zIndex: 1002,
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  leftMenuScroll: {
    flex: 1,
  },
  oneMenuText: {
    color: '#fff',
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 5,
  },
  twoMenuText: {
    color: '#ccc',
    fontSize: 14,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 15,
    marginBottom: 5,
  },
});
export class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
      bookid: null,
      bookname: null,
      contents: [],
      chapters: [], //所有章节
      chapter: null, //当前章节
      chapterArray: [], //章节列表
      schedule: 0, //最后进度
      hasMore: true, //是否已读完
      isRefresh: false, //刷新中
      bgColors: [
        '#e8e8e8',
        '#dfd6c5',
        '#d0bd8a',
        '#a5cda4',
        '#364f70',
        '#605048',
      ],
      colorIndex: 0,
      showControl: false,
      fontSize: 16,
      showMenu: false,
    };
    store.subscribe(this.storeChange);
  }
  storeChange = () => {
    this.setState({
      base: store.getState(),
    });
  };
  componentWillUnmount() {
    StatusBar.setBarStyle('dark-content');
    this.setState = () => {
      return;
    };
  }
  componentDidMount() {
    StatusBar.setBarStyle('dark-content');
    _getCookie('readerColor').then(cookie => {
      if (cookie) {
        this.setState({
          colorIndex: cookie,
        });
      }
    });
    let schedule = 0;
    _getCookie(`schedule-${this.props.navigation.state.params.bookid}`).then(
      cookie => {
        if (cookie) {
          schedule = cookie;
        }
        this.setState(
          {
            schedule: schedule,
            bookid: this.props.navigation.state.params.bookid,
            bookname: this.props.navigation.state.params.bookname,
          },
          () => {
            HTTP.post('/v3/api/book/chapterTree', {
              book_id: this.state.bookid,
            }).then(res => {
              console.log(res)
              if (res.code == 0) {
                let chapterArray = [];
                res.data.chapters.forEach((item, index) => {
                  chapterArray.push({
                    id: item.id,
                    name: item.name,
                    index: chapterArray.length,
                  });
                  if (item.child && item.child.length > 0) {
                    item.child.forEach((bitem, bindex) => {
                      chapterArray.push({
                        id: bitem.id,
                        name: bitem.name,
                        pid: item.id,
                        index: chapterArray.length,
                      });
                    });
                  }
                });
                this.setState(
                  {
                    book: {...res.data.info},
                    chapterArray: chapterArray,
                    chapters: res.data.chapters,
                  },
                  () => {
                    this._loadMoreData(this.state.schedule);
                  },
                );
              } else {
                ToastAndroid.showWithGravity(
                  res.message,
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER,
                );
              }
            });
          },
        );
      },
    );
  }
  //指定章节
  _loadNumber = n => {
    this.setState(
      {
        contents: [],
        hasMore: true,
        showMenu: false,
        showControl: false,
        schedule: parseInt(n),
      },
      () => {
        StatusBar.setBarStyle('dark-content');
        this._loadMoreData(parseInt(n));
      },
    );
  };
  //加载后续章节
  _loadMoreData = n => {
    let {chapterArray, isRefresh, hasMore} = this.state;
    if (isRefresh || !hasMore) return false;
    this.setState(
      {
        isRefresh: true,
        schedule: n,
        chapter: {...chapterArray[n]},
        hasMore: chapterArray.length - 1 >= n ? true : false,
      },
      () => {
        this._getChapterContent();
      },
    );
  };
  //获取章节内容
  _getChapterContent = () => {
    let {chapter, bookid, contents, schedule, book} = this.state;
    _setCookie(`schedule-${bookid}`, this.state.schedule);
    //更新阅读记录
    HTTP.post('/v3/api/bookShelf/updateMemberReadRecord', {
      last_chapter_id: chapter.id,
      chapter_name: chapter.name,
      schedule: chapter.id + '|' + schedule,
      book_type: 2,
      book_id: bookid,
      book_name: book.book_name,
      book_cover: book.book_cover_small,
    });
    HTTP.post('/v4/api/book/getChapterContent', {
      chapter_id: chapter.id,
      book_id: bookid,
    }).then(res => {
      console.log(res)
      if (res.code == 0) {
        let newContent = res.data.content;
        let strs = res.data.content.match(/<body[^>]*>([\s\S]*)<\/body>/);
        if (strs.length >= 3) {
          newContent = strs[1];
        }
        this.setState({
          isRefresh: false,
          content: contents.push({content: newContent}),
        });
      } else {
        this.setState({
          isRefresh: false,
        });
      }
    });
  };
  //下拉刷新
  _onRefresh = () => {
    if (this.state.isRefresh) return;
    this.setState(
      {
        contents: [],
        hasMore: true,
        schedule: 0,
      },
      () => {
        this._loadMoreData(0);
      },
    );
  };
  //加载动画
  _renderFooter = () => {
    if (this.state.hasMore == false) {
      return (
        <View style={styles.footer}>
          <Text style={{fontSize: 12, color: '#999'}}>--本书完--</Text>
        </View>
      );
    } else if (this.state.isRefresh) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator color="#fd6655" />
          <Text style={{fontSize: 12, color: '#999'}}>正在加载章节内容...</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {
              if (this.state.schedule < this.state.chapterArray.length - 1)
                this._loadNumber(schedule + 1);
            }}>
            <Text style={{fontSize: 12, color: '#999'}}>加载一下章</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  //设置背景
  _setColor = index => {
    this.setState({
      colorIndex: index,
    });
    _setCookie(`readerColor`, index);
  };
  //设置字体
  _setfontSize = n => {
    let fontSize = this.state.fontSize;
    if (n < 0) {
      if (fontSize <= 12) {
        fontSize = 12;
      } else {
        fontSize -= 2;
      }
    } else {
      if (fontSize >= 24) {
        fontSize = 24;
      } else {
        fontSize += 2;
      }
    }
    this.setState({
      fontSize: fontSize,
    });
    ToastAndroid.showWithGravity(
      `字体大小: ${fontSize}`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };
  //显示工具栏
  _changeShowControl = () => {
    if (this.state.showControl) {
      StatusBar.setBarStyle('dark-content');
    } else {
      StatusBar.setBarStyle('light-content');
    }
    this.setState({
      showMenu: false,
      showControl: !this.state.showControl,
    });
  };
  render() {
    const {
      contents,
      bgColors,
      colorIndex,
      showControl,
      bookname,
      fontSize,
      schedule,
      chapterArray,
      chapters,
      showMenu,
    } = this.state;
    const _renderItemView = ({item, index}) => {
      return (
        <TouchableWithoutFeedback onPress={this._changeShowControl}>
          <View style={styles.bookChapter}>
            <HTML
              html={item.content}
              imagesMaxWidth={width - 20}
              emSize={32}
              tagsStyles={{
                p: {
                  marginTop: 10,
                  marginBottom: 10,
                  textAlign: 'justify',
                  fontSize: fontSize,
                  lineHeight: 25
                },
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    };
    return (
      <ImageBackground
        style={{
          ...styles.containerParent,
          backgroundColor: bgColors[colorIndex],
        }}>
        {showControl ? (
          <TouchableWithoutFeedback>
            <View style={styles.headerControl}>
              <TouchableOpacity
                style={styles.goBack1}
                onPress={() => {
                  this.props.navigation.goBack();
                }}>
                <MaterialIcons name="arrow-back" size={26} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.videoTitle} numberOfLines={1}>
                {bookname}
              </Text>
              <TouchableOpacity
                style={styles.goBack}
                onPress={() => {
                  this.setState({
                    showMenu: !this.state.showMenu,
                  });
                }}>
                <Feather name="menu" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        ) : null}
        {showControl ? (
          <TouchableWithoutFeedback>
            <View style={styles.footerControl}>
              <View style={styles.control}>
                <TouchableOpacity
                  onPress={() => {
                    if (schedule > 0) this._loadNumber(schedule - 1);
                  }}>
                  <Text style={styles.changeText}>上一章</Text>
                </TouchableOpacity>
                <Slider
                  style={{flex: 1}}
                  thumbTintColor={'#ffffff'}
                  maximumTrackTintColor={'#999999'}
                  minimumTrackTintColor={'#ffffff'}
                  value={schedule}
                  minimumValue={0}
                  maximumValue={this.state.chapterArray.length}
                  onValueChange={i => {
                    this._loadNumber(i);
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (schedule < this.state.chapterArray.length - 1)
                      this._loadNumber(schedule + 1);
                  }}>
                  <Text style={styles.changeText}>下一章</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.colors}>
                <TouchableOpacity onPress={this._setColor.bind(this, 0)}>
                  <View
                    style={{
                      ...styles.color,
                      backgroundColor: bgColors[0],
                      borderColor: colorIndex == 0 ? '#fd6655' : '#000000',
                    }}></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._setColor.bind(this, 1)}>
                  <View
                    style={{
                      ...styles.color,
                      backgroundColor: bgColors[1],
                      borderColor: colorIndex == 1 ? '#fd6655' : '#000000',
                    }}></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._setColor.bind(this, 2)}>
                  <View
                    style={{
                      ...styles.color,
                      backgroundColor: bgColors[2],
                      borderColor: colorIndex == 2 ? '#fd6655' : '#000000',
                    }}></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._setColor.bind(this, 3)}>
                  <View
                    style={{
                      ...styles.color,
                      backgroundColor: bgColors[3],
                      borderColor: colorIndex == 3 ? '#fd6655' : '#000000',
                    }}></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._setColor.bind(this, 4)}>
                  <View
                    style={{
                      ...styles.color,
                      backgroundColor: bgColors[4],
                      borderColor: colorIndex == 4 ? '#fd6655' : '#000000',
                    }}></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._setColor.bind(this, 5)}>
                  <View
                    style={{
                      ...styles.color,
                      backgroundColor: bgColors[5],
                      borderColor: colorIndex == 5 ? '#fd6655' : '#000000',
                    }}></View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        ) : null}
        {showMenu ? (
          <View style={styles.leftMenu}>
            <ScrollView style={styles.leftMenuScroll}>
              {chapterArray.map((item, index) => {
                return (
                  <View style={styles.oneMenu} key={`one-${index}`}>
                    <TouchableOpacity
                      onPress={() => {
                        this._loadNumber(item.index);
                      }}>
                      <Text
                        style={
                          item.pid ? styles.twoMenuText : styles.oneMenuText
                        }
                        numberOfLines={1}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        ) : null}
        <FlatList
          refreshing={false}
          style={styles.container}
          data={contents}
          renderItem={_renderItemView}
          keyExtractor={(item, index) => `chapter-${index}`}
          ListFooterComponent={this._renderFooter}
          onRefresh={this._onRefresh}
          ItemSeparatorComponent={() => {
            return <View style={styles.rowLine}></View>;
          }}
          onEndReached={() => {
            this._loadMoreData(schedule + 1);
          }}
        />
      </ImageBackground>
    );
  }
}

export default index;
