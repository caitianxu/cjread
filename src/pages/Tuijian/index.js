import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import store from '../../script/store';
import {_set_public_loading} from '../../script/action';
import Icons from 'react-native-vector-icons/AntDesign';
import HTTP from '../../script/request';
import Util from '../../script/util';

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  flexPlan: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  maxView: {
    display: 'flex',
    flexDirection: 'row',
    width: width - 20,
    marginBottom: 20,
  },
  maxBookCover: {
    width: width * 0.35,
    height: width * 0.5,
    backgroundColor: '#eee',
  },
  maxDetail: {
    flex: 1,
    paddingLeft: 10,
  },
  bookName: {
    fontSize: 18,
    color: '#000',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  bookRemark: {
    color: '#333',
    textAlign: 'justify',
  },
  minView: {
    width: (width - 50) / 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  minBookCover: {
    width: (width - 50) / 4,
    height: ((width - 50) / 4) * 1.3,
    backgroundColor: '#eee',
  },
  minBookName: {
    fontSize: 12,
    color: '#000',
    marginTop: 2,
  },
  minBookAuthor: {
    fontSize: 10,
    color: '#666',
  },
  reload: {
    width: width - 20,
    alignItems: 'center',
    marginTop: 20,
  },
  action: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  actionIcon: {
    paddingLeft: 5,
    paddingTop: 3,
  },
});
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
      hasMore: true,
      pageNum: 1,
      allData: [],
    };
    store.subscribe(this.storeChange);
  }
  storeChange = () => {
    this.setState({
      base: store.getState(),
    });
  };
  componentDidMount() {
    // ToastAndroid.showWithGravity(
    //   '正在更新内容!',
    //   ToastAndroid.SHORT,
    //   ToastAndroid.CENTER,
    // );
    this.loadMoreData();
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }
  loadMoreData = () => {
    const {hasMore} = this.state;
    if (!hasMore) return false;
    _set_public_loading(true);
    HTTP.post('/v2/api/book/getList', {
      pageSize: 9,
      pageNum: this.state.pageNum,
      book_cat_id: 0,
    }).then(res => {
      if (res.code === 0 && res.data.rows) {
        this.setState({
          hasMore: this.state.pageNum * 9 < res.data.total ? true : false,
          allData: res.data.rows,
        });
      } else {
        this.setState({
          hasMore: false,
        });
      }
      _set_public_loading(false);
    });
  };
  //换一批
  reload = () => {
    this.setState(
      {
        pageNum: this.state.pageNum + 1,
      },
      () => {
        this.loadMoreData();
      },
    );
  };
  //页面跳转
  _goToPage = (key, param) => {
    this.props.navigation.navigate(key, param);
  };
  render() {
    const {allData} = this.state;
    return (
      <View style={styles.safeAreaView}>
        {allData && allData.length > 0 ? (
          <View style={styles.flexPlan}>
            {allData.map((item, index) => {
              return (
                <TouchableOpacity
                  key={`book-${index}`}
                  onPress={this._goToPage.bind(this, 'Book', {
                    id: item.book_id,
                    name: item.book_name,
                  })}>
                  {index == 0 ? (
                    <View style={styles.maxView}>
                      <Image
                        source={{uri: Util.transImgUrl(item.book_cover_small)}}
                        style={styles.maxBookCover}
                        resizeMode="cover"
                      />
                      <View style={styles.maxDetail}>
                        <Text style={styles.bookName} numberOfLines={2}>
                          {item.book_name}
                        </Text>
                        <Text style={styles.bookAuthor} numberOfLines={1}>
                          {item.book_author}
                        </Text>
                        <Text style={styles.bookRemark} numberOfLines={7}>
                          {item.book_remark}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.minView}>
                      <Image
                        source={{uri: Util.transImgUrl(item.book_cover_small)}}
                        style={styles.minBookCover}
                        resizeMode="cover"
                      />
                      <Text style={styles.minBookName} numberOfLines={1}>
                        {item.book_name}
                      </Text>
                      <Text style={styles.minBookAuthor} numberOfLines={1}>
                        {item.book_author}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
            <View style={styles.reload}>
              <TouchableOpacity style={styles.action} onPress={this.reload}>
                <Text>换一组</Text>
                <Icons
                  name="retweet"
                  size={14}
                  color="#999"
                  style={styles.actionIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

export default Page;
