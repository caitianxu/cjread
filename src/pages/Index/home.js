import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-swiper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import store from '../../script/store';
import HTTP from '../../script/request';
import Util from '../../script/util';
import {_getCookie, _setCookie} from '../../script/action';

const {width, height} = Dimensions.get('window');
const ImageWH = (width - 40) / 3; //图书
const ImageVH = (width - 30) / 2; //图书
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 10,
  },
  swiper: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: width * 0.55,
  },
  menuBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 20,
  },
  menuItem: {
    width: 45,
    height: 45,
  },
  menuItemText: {
    textAlign: 'center',
    fontSize: 12,
  },
  weiperDot: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: 8,
    height: 8,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
  },
  weiperAtDot: {
    backgroundColor: 'rgba(255,255,255,1)',
    width: 8,
    height: 8,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
  },
  bannerImg: {
    width: width,
    height: width * 0.55,
  },
  planTitle: {
    paddingTop: 5,
    paddingLeft: 15,
    paddingRight: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planTitleName: {
    fontSize: 16,
    lineHeight: 22,
  },
  planTitleMore: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 5,
  },
  planTitleMoreText: {
    fontSize: 12,
    lineHeight: 14,
    color: '#999',
  },
  videoCover: {
    width: ImageVH,
    height: ImageVH * 0.6,
    borderRadius: 3,
    backgroundColor: '#eee',
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
  flexPlan: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  col3: {
    width: ImageWH,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    alignItems: 'center',
  },
  col2: {
    width: ImageVH,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    alignItems: 'center',
  },
  bannerParent: {
    position: 'relative',
  },
  bannerName: {
    position: 'absolute',
    width: width,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: '#fff',
    padding: 10,
  },
});
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
      hotBooks: [],
      hotVideos: [],
      hotAudios: [],
    };
    store.subscribe(this.storeChange);
  }
  storeChange = () => {
    this.setState({
      base: store.getState(),
    });
  };
  componentDidMount() {
    this.getMainHot();
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }
  //获取热门数据
  getMainHot = (reset) => {
    _getCookie('hotBooks').then((cookie) => {
      if (cookie && !reset) {
        this.setState({
          hotBooks: cookie,
        });
      } else {
        HTTP.post('/api/hbjt/getbooks').then((res) => {
          if (res.code == 0 && res.data.rows) {
            this.setState({
              hotBooks: res.data.rows,
            });
            _setCookie('hotBooks', res.data.rows);
          }
        });
      }
    });
    _getCookie('hotVideos').then((cookie) => {
      if (cookie && !reset) {
        this.setState({
          hotVideos: cookie,
        });
      } else {
        HTTP.post('/api/hbjt/getvideos').then((res) => {
          if (res.code == 0 && res.data.rows) {
            this.setState({
              hotVideos: res.data.rows,
            });
            _setCookie('hotVideos', res.data.rows);
          }
        });
      }
    });
    _getCookie('hotAudios').then((cookie) => {
      if (cookie && !reset) {
        this.setState({
          hotAudios: cookie,
        });
      } else {
        HTTP.post('/api/hbjt/getaudios').then((res) => {
          if (res.code == 0 && res.data.rows) {
            this.setState({
              hotAudios: res.data.rows,
            });
            _setCookie('hotAudios', res.data.rows);
          }
        });
      }
    });
  };
  //页面跳转
  _goToPage = (key, param) => {
    this.props.navigation.navigate(key, param);
  };
  render() {
    const {hotBooks, hotVideos, hotAudios} = this.state;
    return (
      <View style={styles.safeAreaView}>
        <SafeAreaView style={styles.scrollView}>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Swiper
              style={styles.swiper}
              showsButtons={false}
              autoplayTimeout={10}
              autoplay={true}
              dot={<View style={styles.weiperDot} />}
              activeDot={<View style={styles.weiperAtDot} />}>
              {hotVideos.map((item, index) => {
                return (
                  <View key={`swiper-${index}`} style={styles.bannerParent}>
                    <TouchableOpacity
                      onPress={this._goToPage.bind(this, 'Video', {...item})}>
                      <Image
                        source={{uri: Util.transImgUrl(item.cover_url_small)}}
                        style={styles.bannerImg}
                        resizeMode="cover"
                      />
                      <Text style={styles.bannerName} numberOfLines={1}>
                        {item.video_title}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </Swiper>
            {/* 菜单 */}
            <View style={styles.menuBar}>
              <TouchableOpacity
                onPress={this._goToPage.bind(this, 'Tuijian', null)}>
                <View>
                  <Image
                    source={require('./img/m1.png')}
                    style={styles.menuItem}
                  />
                  <Text style={styles.menuItemText}>推荐</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this._goToPage.bind(this, 'Books', null)}>
                <View>
                  <Image
                    source={require('./img/m2.png')}
                    style={styles.menuItem}
                  />
                  <Text style={styles.menuItemText}>图书</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this._goToPage.bind(this, 'Audios', null)}>
                <View>
                  <Image
                    source={require('./img/m3.png')}
                    style={styles.menuItem}
                  />
                  <Text style={styles.menuItemText}>听书</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this._goToPage.bind(this, 'Videos', null)}>
                <View>
                  <Image
                    source={require('./img/m4.png')}
                    style={styles.menuItem}
                  />
                  <Text style={styles.menuItemText}>视频</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this._goToPage.bind(this, 'News', null)}>
                <View>
                  <Image
                    source={require('./img/m5.png')}
                    style={styles.menuItem}
                  />
                  <Text style={styles.menuItemText}>报刊</Text>
                </View>
              </TouchableOpacity>
            </View>
            {/* 最新图书 */}
            <View>
              <View style={styles.planTitle}>
                <Text style={styles.planTitleName}>最新图书</Text>
                <TouchableOpacity
                  onPress={this._goToPage.bind(this, 'Books', null)}>
                  <View style={styles.planTitleMore}>
                    <Text style={styles.planTitleMoreText}>更多</Text>
                    <AntDesign name="doubleright" size={12} color="#999" />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.flexPlan}>
                {hotBooks.map((item, index) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      key={`book-${index}`}
                      onPress={this._goToPage.bind(this, 'Book', {...item})}>
                      <View style={styles.col3}>
                        <Image
                          style={styles.bookCover}
                          source={{
                            uri: Util.transImgUrl(item.book_cover_small),
                          }}
                        />
                        <Text style={styles.bookName} numberOfLines={1}>
                          {item.book_name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            {/* 最新视频 */}
            <View>
              <View style={styles.planTitle}>
                <Text style={styles.planTitleName}>最新视频</Text>
                <TouchableOpacity
                  onPress={this._goToPage.bind(this, 'Videos', null)}>
                  <View style={styles.planTitleMore}>
                    <Text style={styles.planTitleMoreText}>更多</Text>
                    <AntDesign name="doubleright" size={12} color="#999" />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.flexPlan}>
                {hotVideos.map((item, index) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      key={`audio-${index}`}
                      onPress={this._goToPage.bind(this, 'Video', {...item})}>
                      <View style={styles.col2}>
                        <Image
                          style={styles.videoCover}
                          source={{
                            uri: Util.transImgUrl(item.cover_url_small),
                          }}
                        />
                        <Text style={styles.bookName} numberOfLines={1}>
                          {item.video_title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            {/* 最新听书 */}
            <View>
              <View style={styles.planTitle}>
                <Text style={styles.planTitleName}>最新听书</Text>
                <TouchableOpacity
                  onPress={this._goToPage.bind(this, 'Audios', null)}>
                  <View style={styles.planTitleMore}>
                    <Text style={styles.planTitleMoreText}>更多</Text>
                    <AntDesign name="doubleright" size={12} color="#999" />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.flexPlan}>
                {hotAudios.map((item, index) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      key={`audio-${index}`}
                      onPress={this._goToPage.bind(this, 'Audio', {...item})}>
                      <View style={styles.col3}>
                        <Image
                          style={styles.bookCover}
                          source={{
                            uri: Util.transImgUrl(item.cover_url_small),
                          }}
                        />
                        <Text style={styles.bookName} numberOfLines={1}>
                          {item.audio_title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
export default Page;
