import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import {View, Image} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';

import BookRack from './BookRack';
import Index from './Index';
import Search from './Search';
import Setting from './Setting';
import Me from './Me';
import Videos from './Videos';
import Audios from './Audios';
import Books from './Books';
import Video from './Video';
import Audio from './Audio';
import Book from './Book';
import Tuijian from './Tuijian';
import VideoPlay from './VideoPlay';
import News from './News';
import Login from './Login';
import Reviews from './Reviews';
import AudioPlay from './AudioPlay';
import Register from './Register';
import Reader from './Reader';

const headerRight = navigation => {
  return (
    <View>
      <Icons
        name="md-search"
        style={{paddingRight: 15, paddingLeft: 15, paddingTop: 5}}
        size={25}
        color="#999"
        onPress={e => {
          navigation.navigate('Search');
        }}
      />
    </View>
  );
};
const publicRouter = {
  Search: {
    screen: Search,
  },
  Setting: {
    screen: Setting,
  },
  Reviews: {
    screen: Reviews,
    navigationOptions: {
      headerTitle: '我的评论',
    },
  },
  Videos: {
    screen: Videos,
    navigationOptions: ({navigation}) => {
      return {
        headerTitle: '视频',
        headerTintColor: '#fd6655',
        headerRight: headerRight.bind(this, navigation),
      };
    },
  },
  Audios: {
    screen: Audios,
    navigationOptions: ({navigation}) => {
      return {
        headerTitle: '听书',
        headerTintColor: '#fd6655',
        headerRight: headerRight.bind(this, navigation),
      };
    },
  },
  Books: {
    screen: Books,
    navigationOptions: ({navigation}) => {
      return {
        headerTitle: '图书',
        headerTintColor: '#fd6655',
        headerRight: headerRight.bind(this, navigation),
      };
    },
  },
  Video: {
    screen: Video,
    navigationOptions: ({navigation}) => {
      let str = navigation.state.params.video_title;
      if (str.length > 10) {
        str = str.substr(0, 12) + '...';
      }
      return {
        headerTitle: str,
        headerRight: headerRight.bind(this, navigation),
      };
    },
  },
  Audio: {
    screen: Audio,
    navigationOptions: ({navigation}) => {
      let str = navigation.state.params.audio_title;
      if (str.length > 10) {
        str = str.substr(0, 12) + '...';
      }
      return {
        headerTitle: str,
        headerRight: headerRight.bind(this, navigation),
      };
    },
  },
  Book: {
    screen: Book,
    navigationOptions: ({navigation}) => {
      let str = navigation.state.params.book_name;
      if (str.length > 10) {
        str = str.substr(0, 12) + '...';
      }
      return {
        headerTitle: str,
        headerRight: headerRight.bind(this, navigation),
      };
    },
  },
  Tuijian: {
    screen: Tuijian,
    navigationOptions: ({navigation}) => {
      return {
        headerTitle: '好书推荐',
        headerTintColor: '#fd6655',
        headerRight: headerRight.bind(this, navigation),
      };
    },
  },
  VideoPlay: {
    screen: VideoPlay,
    navigationOptions: ({navigation}) => ({
      headerShown: false,
    }),
  },
  AudioPlay: {
    screen: AudioPlay,
    navigationOptions: ({navigation}) => ({
      headerShown: false,
    }),
  },
  News: {
    screen: News,
    navigationOptions: ({navigation}) => ({
      headerShown: false,
    }),
  },
  Register: {
    screen: Register,
    navigationOptions: ({navigation}) => {
      return {
        headerTitle: '新用户注册',
        headerTintColor: '#fd6655',
      };
    },
  },
  Login: {
    screen: Login,
    navigationOptions: ({navigation}) => ({
      headerTitle: '用户登录',
      headerLeft: () => null,
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
      },
      headerTitleContainerStyle: {
        left: 70,
        right: 70,
      },
    }),
  },
  Reader: {
    screen: Reader,
    navigationOptions: ({navigation}) => ({
      headerShown: false,
    }),
  },
};
// 书架
const navigatorRack = createStackNavigator(
  {
    BookRack: {
      screen: BookRack,
      navigationOptions: {
        headerTitle: '我的书架',
        headerShown: false,
      },
    },
  },
  {
    // 设置二级页面隐藏tabBar
    navigationOptions: ({navigation}) => ({
      tabBarVisible: navigation.state.index > 0 ? false : true,
    }),
  },
);
//悦读
const navigatorHome = createStackNavigator(
  {
    Home: {
      screen: Index,
      navigationOptions: ({navigation}) => {
        return {
          headerTitle: '微悦读',
          headerTintColor: '#fd6655',
          headerRight: headerRight.bind(this, navigation),
        };
      },
    },
    ...publicRouter,
  },
  {
    // 设置二级页面隐藏tabBar
    navigationOptions: ({navigation}) => ({
      tabBarVisible: navigation.state.index > 0 ? false : true,
    }),
  },
);
// 我的
const navigatorMe = createStackNavigator(
  {
    Me: {
      screen: Me,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
  },
  {
    // 设置二级页面隐藏tabBar
    navigationOptions: ({navigation}) => ({
      tabBarVisible: navigation.state.index > 0 ? false : true,
    }),
  },
);

const TabNavigator = createBottomTabNavigator(
  {
    BarRack: {
      screen: navigatorRack,
      navigationOptions: ({navigation}) => {
        return {
          tabBarLabel: '书架',
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={
                  focused
                    ? require('../assets/img/rack-at.png')
                    : require('../assets/img/rack.png')
                }
                style={{width: 26, height: 26}}
              />
            );
          },
        };
      },
    },
    BarMain: {
      screen: navigatorHome,
      navigationOptions: ({navigation}) => {
        return {
          tabBarLabel: '悦读',
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={
                  focused
                    ? require('../assets/img/home-at.png')
                    : require('../assets/img/home.png')
                }
                style={{width: 25, height: 25}}
              />
            );
          },
        };
      },
    },
    BarMe: {
      screen: navigatorMe,
      navigationOptions: ({navigation}) => {
        return {
          tabBarLabel: '我的',
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={
                  focused
                    ? require('../assets/img/me-at.png')
                    : require('../assets/img/me.png')
                }
                style={{width: 26, height: 26}}
              />
            );
          },
        };
      },
    },
  },
  {
    initialRouteName: 'BarMain',
    tabBarOptions: {
      inactiveTintColor: '#aaaaaa',
      activeTintColor: '#fd6655',
    },
  },
);

export default createAppContainer(TabNavigator);
