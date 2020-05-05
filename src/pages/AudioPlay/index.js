import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import {_set_public_loading} from '../../script/action';
import store from '../../script/store';
import Sound from 'react-native-sound';
import Util from '../../script/util';
import Slider from '@react-native-community/slider';
import Entypo from 'react-native-vector-icons/Entypo';
import HTTP from '../../script/request';

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#f90',
    paddingTop: 30,
  },
  sprint: {
    width: width,
    // height: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  audioBorder: {
    elevation: 15,
    borderRadius: width * 0.25,
    backgroundColor: '#000',
    position: 'relative',
  },
  audioCover: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
  },
  control: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    width: width,
    zIndex: 1002,
    paddingLeft: 20,
    paddingRight: 20,
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
    marginRight: 10,
  },
  audioName: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#666',
    marginBottom: 15,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 30,
  },
  action1: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  action2: {
    paddingTop: 11,
    paddingBottom: 11,
    paddingLeft: 5,
    paddingRight: 5,
  },
  action3: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  audioRemarkParent: {
    height: width / 2,
    marginBottom: 20,
  },
  audioRemark: {
    paddingLeft: 20,
    paddingRight: 20,
    lineHeight: 22,
    textAlign: 'justify',
  },
  action0: {
    position: 'absolute',
    left: 10,
    color: '#fff',
    padding: 10,
    top: 30,
  },
});
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
      audio: null,
      play: true,
      loop: false,
      duration: 0, //持续时长
      currentTime: 0, //播放时长
      rotateValue: new Animated.Value(0),
    };
    store.subscribe(this.storeChange);
    this.AnimatedElement = Animated.timing(this.state.rotateValue, {
      toValue: 1, //角度从0变1
      duration: 15000, //从0到1的时间
      easing: Easing.out(Easing.linear), //线性变化，匀速旋转
    });
  }
  storeChange = () => {
    this.setState({
      base: store.getState(),
    });
  };
  componentWillUnmount() {
    StatusBar.setBarStyle('dark-content');
    this.mySound.stop();
    this.setState = () => {
      return;
    };
  }
  componentDidMount() {
    StatusBar.setBarStyle('light-content');
    this.setState(
      {
        audio: {...this.props.navigation.state.params},
      },
      () => {
        this._isChcollect(this.state.audio);
        this._init();
        this.getAudios();
      },
    );
  }
  //初始化
  _init = () => {
    _set_public_loading(true);
    this.mySound = new Sound(this.state.audio.audio_url, null, error => {
      _set_public_loading(false);
      if (error) {
        return;
      }
      this.setState(
        {
          play: true,
          duration: this.mySound.getDuration(),
        },
        () => {
          //开始旋转动画
          this.startAnimation();
        },
      );
      this.mySound.setVolume(1);
      this.mySound.play();
      this._getNowTime();
      if (this.state.loop) {
        this.mySound.setNumberOfLoops(-1);
      } else {
        this.mySound.setNumberOfLoops(0);
      }
    });
  };
  //设置循环
  _setLoop = () => {
    this.setState(
      {
        loop: !this.state.loop,
      },
      () => {
        if (this.state.loop) {
          this.mySound.setNumberOfLoops(-1);
        } else {
          this.mySound.setNumberOfLoops(0);
        }
      },
    );
  };
  //开始动画
  startAnimation() {
    this.AnimatedElement.start(() => {
      this.AnimatedElement = Animated.timing(this.state.rotateValue, {
        toValue: 1, // 最终值 为1，这里表示最大旋转 360度
        duration: 15000,
        easing: Easing.out(Easing.linear),
      });
      this.rotating();
    });
  }
  //循环动画
  rotating(value) {
    if (this.state.play) {
      this.state.rotateValue.setValue(value || 0);
      this.AnimatedElement.start(() => {
        this.rotating();
      });
    }
  }
  //变更动画状态
  _changeAnimated = () => {
    this.setState(
      {
        play: !this.state.play,
      },
      () => {
        if (this.state.play) {
          this.rotating(this.state.rotateValue._value);
          this.mySound.play();
        } else {
          this.mySound.pause();
          this.AnimatedElement.stop(oneTimeRotate => {
            this.AnimatedElement = Animated.timing(this.state.rotateValue, {
              toValue: 1,
              duration: (1 - oneTimeRotate) * 15000,
              easing: Easing.out(Easing.linear),
            });
          });
        }
      },
    );
  };
  //进度条改变
  onSliderValueChanged = currentTime => {
    this.mySound.setCurrentTime(currentTime);
    if (this.state.play) {
      this.setState({
        currentTime: currentTime,
      });
    } else {
      this.setState({
        currentTime: currentTime,
        play: true,
      });
    }
  };
  //获取当前播放时间
  _getNowTime = () => {
    clearInterval(this.timemer);
    this.timemer = setInterval(() => {
      if (this.state.play) {
        this.mySound.getCurrentTime(seconds => {
          this.setState({
            currentTime: seconds,
          });
        });
      }
    }, 1000);
  };
  //是否收藏
  _isChcollect = param => {
    HTTP.post('/api/hbjt/searchcollect', {
      type: 2,
      media_id: param.audio_id,
    }).then(res => {
      if (res.code == 0 && res.data) {
        this.setState({
          audio: {
            ...param,
            shelf_id: 1,
          },
        });
      } else {
        this.setState({
          audio: {
            ...param,
          },
        });
      }
    });
  };
  //收藏
  _changeShelf = () => {
    let {audio} = this.state;
    HTTP.post('/api/hbjt/addcollect', {
      type: 2,
      media_id: audio.audio_id,
    }).then(res => {
      if (audio.shelf_id) {
        audio.shelf_id = null;
        ToastAndroid.showWithGravity(
          '取消收藏成功!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else {
        audio.shelf_id = 1;
        ToastAndroid.showWithGravity(
          '收藏成功!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
      this.setState({
        audio: {...audio},
      });
    });
  };
  //切换音频
  changeAudio = n => {
    const {audios, audio} = this.state;
    let index = 0;
    audios.forEach((item, i) => {
      if (item.audio_id === audio.audio_id) {
        index = i;
      }
    });
    index = index + n >= 0 ? index + n : 0;
    const au = audios[index];
    if (au) {
      clearInterval(this.timemer);
      this.setState(
        {
          play: false,
          currentTime: 0,
          duration: 0,
          audio: {...au},
        },
        () => {
          this.state.rotateValue.setValue(0);
          this.AnimatedElement.stop(oneTimeRotate => {
            this.AnimatedElement = Animated.timing(this.state.rotateValue, {
              toValue: 1,
              duration: (1 - oneTimeRotate) * 15000,
              easing: Easing.out(Easing.linear),
            });
          });
          if (this.mySound) {
            this.mySound.reset();
          }
          this._isChcollect(this.state.audio);
          this._init();
        },
      );
    } else {
      ToastAndroid.showWithGravity(
        '没有更多内容了!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };
  //获取播放列表
  getAudios = () => {
    const {audio} = this.state;
    HTTP.post('/api/hbjt/audio/getList', {
      pageSize: 100,
      pageNum: 1,
      cid: audio.audio_cat_id,
    }).then(res => {
      this.setState({
        audios: res.data.rows,
      });
    });
  };
  render() {
    const {audio, duration, currentTime, play} = this.state;
    return (
      <ImageBackground
        source={require('../../assets/img/audio-bg.jpg')}
        style={styles.safeAreaView}>
        <TouchableOpacity
          style={styles.action0} 
          onPress={() => {
            this.props.navigation.goBack();
          }}>
          <Entypo name="chevron-thin-left" size={22} />
        </TouchableOpacity>

        <View style={styles.sprint}>
          {audio ? (
            <TouchableWithoutFeedback onPress={this._changeAnimated}>
              <View style={styles.audioBorder}>
                <Animated.Image
                  source={{uri: Util.transImgUrl(audio.cover_url_small)}}
                  style={{
                    width: 130,
                    height: 180,
                    // borderRadius: 75,
                    // transform: [
                    //   {
                    //     rotateZ: this.state.rotateValue.interpolate({
                    //       inputRange: [0, 1],
                    //       outputRange: ['0deg', '360deg'],
                    //     }),
                    //   },
                    // ],
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          ) : null}
        </View>
        <Text style={styles.audioName} numberOfLines={1}>
          {audio ? audio.audio_title : ''}
        </Text>
        <View style={styles.audioRemarkParent}>
          <ScrollView>
            <Text style={styles.audioRemark}>
              &nbsp;&nbsp;{audio ? audio.audio_remark : ''}
            </Text>
          </ScrollView>
        </View>
        <View style={styles.control}>
          <Text style={styles.time}>{Util.formatTime(currentTime)}</Text>
          <Slider
            style={{flex: 1}}
            thumbTintColor={'#ffffff'}
            maximumTrackTintColor={'#666666'}
            minimumTrackTintColor={'#ffffff'}
            value={currentTime}
            minimumValue={0}
            maximumValue={duration}
            onValueChange={currentTime => {
              this.onSliderValueChanged(currentTime);
            }}
          />
          <Text style={styles.time}>{Util.formatTime(duration)}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={this._setLoop}>
            <Entypo
              name="cycle"
              size={22}
              color={this.state.loop ? '#43308a' : '#787878'}
              style={styles.action1}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.changeAudio.bind(this, -1)}>
            <Entypo
              name="controller-jump-to-start"
              size={30}
              color="#787878"
              style={styles.action2}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this._changeAnimated}>
            <Entypo
              name={play ? 'controller-paus' : 'controller-play'}
              size={50}
              color="#787878"
              style={styles.action3}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.changeAudio.bind(this, 1)}>
            <Entypo
              name="controller-next"
              size={30}
              color="#787878"
              style={styles.action2}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this._changeShelf}>
            <Entypo
              name={audio && audio.shelf_id ? 'heart' : 'heart-outlined'}
              size={22}
              color={audio && audio.shelf_id ? '#43308a' : '#787878'}
              style={styles.action1}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

export default Page;
