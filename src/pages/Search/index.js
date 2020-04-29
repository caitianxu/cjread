import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Home from './home';
import store from '../../script/store';
import {_change_search_text} from '../../script/action';

const Stack = createStackNavigator();
const styles = StyleSheet.create({
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
  pageArrowleft: {
    paddingLeft: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
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
    _change_search_text(null);
  }
  _toSearch = () => {
    this.searchElement.blur();
    this.setState(
      {
        searchText: this.state.search,
        hasMore: true,
        pageNum: 1,
        allData: [],
        isLoading: false,
      },
      () => {
        _change_search_text(this.state.search);
      },
    );
  };
  //输入
  _changeContent = (text) => {
    this.setState({
      search: text,
    });
  };
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="HomeIndex"
          component={Home}
          options={({navigation}) => {
            return {
              title: '微悦读',
              headerTintColor: '#fd6655',
              header: ({navigation}) => {
                return (
                  <View style={styles.pageHeader}>
                    <TouchableOpacity
                      style={styles.pageArrowleft}
                      onPress={() => {
                        navigation.goBack();
                      }}>
                      <AntDesign name="arrowleft" size={28} color="#444444" />
                    </TouchableOpacity>
                    <View style={styles.search}>
                      <TextInput
                        style={styles.searchInput}
                        returnKeyType="search"
                        onChangeText={(text) => {
                          this._changeContent(text);
                        }}
                        onEndEditing={() => {
                          this._toSearch();
                        }}
                        ref={(el) => (this.searchElement = el)}
                        placeholder="搜索图书名称/作者"
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={this._toSearch}>
                      <Text style={styles.searchBtnText}>搜索</Text>
                    </TouchableOpacity>
                  </View>
                );
              },
            };
          }}
        />
      </Stack.Navigator>
    );
  }
}
export default Page;
