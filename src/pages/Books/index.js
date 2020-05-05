import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import store from '../../script/store';
import HTTP from '../../script/request';
import Util from '../../script/util';

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  cats: {
    backgroundColor: '#f4f4f4',
  },
  content: {
    width: width * 0.78,
    backgroundColor: '#fff',
    paddingLeft: 15,
    paddingTop: 10,
  },
  cat: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  activeCat: {
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  text: {
    paddingLeft: 12,
    paddingRight: 10,
    textAlign: 'center'
  },
  activeText: {
    paddingLeft: 12,
    paddingRight: 10,
    color: '#fd6655',
    borderLeftColor: '#fd6655',
    borderLeftWidth: 3,
    textAlign: 'center'
  },
  rowLine: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 10,
    marginTop: 10,
  },
  footer: {
    alignItems: 'center',
    paddingRight: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  bookRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  bookCover: {
    width: width * 0.2,
    height: width * 0.28,
    backgroundColor: '#eee',
  },
  bookDetail: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
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
});
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
      hasMore: true,
      isLoading: false,
      isRefresh: false,
      pageNum: 1,
      allData: [],
      cats: [],
      selCat: null,
    };
    store.subscribe(this.storeChange);
  }
  storeChange = () => {
    this.setState({
      base: store.getState(),
    });
  };
  componentDidMount() {
    HTTP.post('/v2/api/bookCat/getList').then(res => {
      if (res.code == 0 && res.data.length > 0) {
        this.setState(
          {
            cats: [...res.data],
          },
          () => {
            this._changeCat(res.data[0]);
          },
        );
      }
    });
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }
  //修改分类
  _changeCat = cat => {
    this.setState(
      {
        pageNum: 1,
        hasMore: true,
        allData: [],
        selCat: {...cat},
      },
      () => {
        this._loadMoreData();
      },
    );
  };
  //获取列表数据
  _loadMoreData = () => {
    const {isLoading, hasMore, selCat, pageNum} = this.state;
    if (isLoading || !hasMore) return;
    this.setState({
      isLoading: true,
    });
    HTTP.post('/v2/api/book/getList', {
      pageSize: 10,
      pageNum: pageNum,
      book_cat_id: selCat.book_cat_id,
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
    const {cats, selCat, allData} = this.state;
    const _renderItemView = ({item}) => {
      return (
        <TouchableOpacity
          onPress={this._goToPage.bind(this, 'Book', {...item})}>
          <View style={styles.bookRow}>
            <Image
              source={{uri: Util.transImgUrl(item.book_cover_small)}}
              style={styles.bookCover}
              resizeMode="cover"
            />
            <View style={styles.bookDetail}>
              <Text style={styles.bookName} numberOfLines={2}>
                {item.book_name}
              </Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>
                {item.book_author}
              </Text>
              <Text style={styles.bookRemark} numberOfLines={3}>
                {item.book_remark}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View style={styles.safeAreaView}>
        <ScrollView style={styles.cats}>
          {cats.map((cat, index) => {
            return (
              <TouchableOpacity
                key={`cat-${index}`}
                onPress={this._changeCat.bind(this, cat)}
                style={
                  selCat && selCat.book_cat_id == cat.book_cat_id
                    ? styles.activeCat
                    : styles.cat
                }>
                <Text
                  numberOfLines={1}
                  style={
                    selCat && selCat.book_cat_id == cat.book_cat_id
                      ? styles.activeText
                      : styles.text
                  }>
                  {cat.book_cat_name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.content}>
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
      </View>
    );
  }
}

export default Page;
