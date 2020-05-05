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
    paddingRight: 10
  },
  activeText: {
    paddingLeft: 12,
    paddingRight: 10,
    color: '#fd6655',
    borderLeftColor: '#fd6655',
    borderLeftWidth: 3
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
    alignItems: 'flex-start',
    position: 'relative',
  },
  bookCover: {
    width: width * 0.78 - 30,
    height: (width * 0.78 - 25) * 0.5,
    backgroundColor: '#eee',
  },
  bookDetail: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    left: 0,
    right: 15,
    bottom: 0,
    padding: 5,
  },
  bookName: {
    color: '#fff',
    fontSize: 12,
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
    HTTP.post('/api/hbjt/video/getVideoCats').then(res => {
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
    HTTP.post('/api/hbjt/video/getList', {
      pageSize: 10,
      pageNum: pageNum,
      cid: selCat.video_cat_id,
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
          onPress={this._goToPage.bind(this, 'Video', {...item})}>
          <View style={styles.bookRow}>
            <Image
              source={{uri: Util.transImgUrl(item.cover_url_small)}}
              style={styles.bookCover}
              resizeMode="cover"
            />
            <View style={styles.bookDetail}>
              <Text style={styles.bookName} numberOfLines={1}>
                {item.video_title}
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
                  selCat && selCat.video_cat_id == cat.video_cat_id
                    ? styles.activeCat
                    : styles.cat
                }>
                <Text
                  numberOfLines={
                    selCat && selCat.video_cat_id == cat.video_cat_id ? 2 : 1
                  }
                  style={
                    selCat && selCat.video_cat_id == cat.video_cat_id
                      ? styles.activeText
                      : styles.text
                  }>
                  {cat.video_cat_name}
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
