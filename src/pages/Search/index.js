import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import store from '../../script/store';
import HTTP from '../../script/request';
import Util from '../../script/util';
import AntDesign from 'react-native-vector-icons/AntDesign';

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  bookRow: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
  },
  bookCoverBorder: {
    elevation: 5,
    borderWidth: 1,
    borderColor: '#fff',
  },
  bookCover: {
    width: width * 0.3,
    height: width * 0.4,
    backgroundColor: '#eee',
  },
  bookDetail: {
    flex: 1,
    paddingLeft: 10,
  },
  bookName: {
    color: '#000',
    fontSize: 16,
  },
  bookAuthor: {
    fontSize: 10,
    marginTop: 5,
    marginBottom: 5,
    color: '#999',
  },
  bookRemark: {
    fontSize: 12,
    textAlign: 'justify',
  },
  rowLine: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 15,
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  footer: {
    alignItems: 'center',
    paddingRight: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  pageHeader: {
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 2,
  },
  search: {
    flex: 1,
    paddingLeft: 10,
    borderRadius: 3,
    height: 40,
    marginTop: 5,
    backgroundColor: 'rgba(100,100,100,0.3)',
  },
  searchInput: {
    height: 40,
    lineHeight: 30,
  },
  pageArrowleft: {
    paddingLeft: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
  },
  searchButton: {
    backgroundColor: '#fd6655',
    marginTop: 5,
    marginLeft: 10,
    height: 40,
    borderRadius: 5,
  },
  searchBtnText: {
    color: '#fff',
    height: 40,
    lineHeight: 40,
    paddingLeft: 20,
    paddingRight: 20,
  },
});
let _that;
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
      hasMore: true,
      pageNum: 1,
      allData: [],
      isRefresh: false,
      isLoading: false,
      searchText: null,
      search: null,
    };
    store.subscribe(this.storeChange);
    _that = this;
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
  _toSearch = () => {
    _that.searchElement.blur();
    this.setState(
      {
        searchText: this.state.search,
        hasMore: true,
        pageNum: 1,
        allData: [],
        isLoading: false,
      },
      () => {
        this._loadMoreData();
      },
    );
  };
  //输入
  _changeContent = text => {
    this.setState({
      search: text,
    });
  };
  static navigationOptions = ({navigation}) => {
    return {
      header: () => {
        return (
          <View style={styles.pageHeader}>
            <TouchableOpacity
              style={styles.pageArrowleft}
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesign
                name="arrowleft"
                size={28}
                color="#444444"
                style={styles.unIcon}
              />
            </TouchableOpacity>
            <View style={styles.search}>
              <TextInput
                style={styles.searchInput}
                returnKeyType="search"
                onChangeText={text => {
                  _that._changeContent(text);
                }}
                onEndEditing={() => {
                  _that._toSearch();
                }}
                ref={el => (_that.searchElement = el)}
                placeholder="搜索图书名称/作者"
              />
            </View>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={_that._toSearch}>
              <Text style={styles.searchBtnText}>搜索</Text>
            </TouchableOpacity>
          </View>
        );
      },
    };
  };
  componentDidMount() {
    this._loadMoreData();
  }
  //获取列表数据
  _loadMoreData = () => {
    const {isLoading, hasMore, pageNum, searchText} = this.state;
    if (isLoading || !hasMore) return;
    this.setState({
      isLoading: true,
    });
    HTTP.post('/v2/api/book/getList', {
      pageSize: 10,
      pageNum: pageNum,
      searchText: searchText,
    }).then(res => {
      if (res.code === 0 && res.data.rows) {
        let allData = this.state.allData.concat(res.data.rows);
        if (this.state.isRefresh) {
          allData = res.data.rows;
        }
        let more = allData.length < res.data.total ? true : false;
        this.setState({
          isLoading: false,
          hasMore: more,
          allData: allData,
          isRefresh: false,
        });
      } else {
        this.setState({
          isLoading: false,
          hasMore: false,
          isRefresh: false,
        });
      }
    });
  };
  //滚动加载
  _reload = () => {
    if (this.state.isLoading || !this.state.hasMore) return;
    this.setState(
      {
        pageNum: this.state.pageNum + 1,
      },
      () => {
        this._loadMoreData();
      },
    );
  };
  //加载动画
  _renderFooter = () => {
    if (this.state.hasMore == false) {
      return (
        <View style={styles.footer}>
          <Text style={{fontSize: 12, color: '#999'}}>没有更多数据了</Text>
        </View>
      );
    } else if (this.state.isLoading) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator color="#fd6655" />
          <Text style={{fontSize: 12, color: '#999'}}>正在加载更多数据...</Text>
        </View>
      );
    } else {
      return <View></View>;
    }
  };
  //下拉刷新
  _onRefresh = () => {
    if (this.state.isRefresh) return;
    this.setState(
      {
        pageNum: 1,
        isRefresh: true,
        hasMore: true,
        isLoading: false,
      },
      () => {
        this._loadMoreData();
      },
    );
  };
  //页面跳转
  _goToPage = (key, param) => {
    this.props.navigation.navigate(key, param);
  };
  render() {
    const {allData} = this.state;
    const _renderItemView = ({item}) => {
      return (
        <TouchableOpacity
          onPress={this._goToPage.bind(this, 'Book', {...item})}>
          <View style={styles.bookRow}>
            <View style={styles.bookCoverBorder}>
              <Image
                source={{uri: Util.transImgUrl(item.book_cover_small)}}
                style={styles.bookCover}
                resizeMode="cover"
              />
            </View>
            <View style={styles.bookDetail}>
              <Text style={styles.bookName} numberOfLines={2}>
                {item.book_name}
              </Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>
                {item.book_author}
              </Text>
              <Text style={styles.bookRemark} numberOfLines={6}>
                {item.book_remark}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View style={styles.container}>
        <FlatList
          data={allData}
          renderItem={_renderItemView}
          keyExtractor={(item, index) => `row-${index}`}
          ItemSeparatorComponent={() => {
            return <View style={styles.rowLine}></View>;
          }}
          onEndReached={this._reload}
          ListFooterComponent={this._renderFooter}
          onRefresh={this._onRefresh}
          refreshing={false}
        />
      </View>
    );
  }
}

export default Page;
