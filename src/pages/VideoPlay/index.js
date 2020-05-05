import React from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import Util from '../../script/util';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: null,
      title: null,
      width: 750,
      height: 350,
      loading: true,
      play: true,
      max: false,
      currentTime: 0, // 视频当前播放的时间
      duration: 0, // 视频的总时长
      showControl: true, //显示工具栏
    };
  }
  componentDidMount() {
    StatusBar.setHidden(true);
    this.setState({
      uri: this.props.navigation.state.params.uri,
      title: this.props.navigation.state.params.title,
    });
  }
  componentWillUnmount() {
    // Orientation.lockToPortrait();
    StatusBar.setHidden(false);
    StatusBar.setTranslucent(true);
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('rgba(0,0,0,0)');
  }
  //动态计算高度
  _onLayout = event => {
    let {width, height} = event.nativeEvent.layout;
    this.setState({
      width: width,
      height: height,
    });
  };
  //暂停 播放
  _play = () => {
    this.setState({
      play: !this.state.play,
    });
  };
  //播放
  _play1 = () => {
    this.setState({
      play: true,
      showControl: false,
    });
  };
  // 全屏
  _max = () => {
    this.setState(
      {
        max: !this.state.max,
      },
      () => {
        if (this.state.max) {
          // Orientation.lockToLandscape();
          this.player.presentFullscreenPlayer();
        } else {
          this.player.dismissFullscreenPlayer();
          // Orientation.lockToPortrait();
        }
      },
    );
  };
  //进度条改变
  onSliderValueChanged = currentTime => {
    this.player.seek(currentTime);
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
  //加载完成
  _onLoaded = data => {
    this.setState({
      duration: data.duration,
      loading: false,
    });
    this._closeControl();
  };
  //关闭工具栏
  _closeControl = () => {
    this.timeOut = setTimeout(() => {
      this.setState({
        showControl: false,
      });
    }, 5000);
  };
  //显示工具栏
  _showControl = () => {
    clearTimeout(this.timeOut);
    this.setState({
      showControl: true,
    });
  };
  //视频点击
  _videoEvent = () => {
    this.setState({
      showControl: !this.state.showControl,
    });
  };
  //播放进度
  _onProgressChanged = data => {
    if (this.state.play) {
      this.setState({
        currentTime: data.currentTime,
      });
    }
  };
  //返回
  _goBack = () => {
    this.props.navigation.goBack();
  }
  render() {
    const {
      uri,
      title,
      width,
      height,
      play,
      max,
      loading,
      currentTime,
      duration,
      showControl,
    } = this.state;
    const styles = StyleSheet.create({
      fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 1000,
      },
      videoFull: {
        width: width,
        height: height,
        backgroundColor: '#000000',
      },
      headerControl: {
        flexDirection: 'row',
        height: 44,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        zIndex: 1002,
        padding: 10,
      },
      goBack: {
        padding: 10,
      },
      videoTitle: {
        flex: 1,
        color: '#fff',
        fontSize: 18,
        paddingRight: 10
      },
      control: {
        flexDirection: 'row',
        height: 44,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: width,
        zIndex: 1002,
      },
      time: {
        fontSize: 12,
        color: 'white',
        marginLeft: 10,
        marginRight: 10,
      },
      loading: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 1001,
        justifyContent: 'center',
      },
      button1: {
        height: 44,
        paddingLeft: 10,
        paddingTop: 11,
      },
      button2: {
        height: 44,
        paddingRight: 10,
        paddingTop: 11,
      },
      toPlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 44,
        right: 0,
        zIndex: 1001,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
    });

    return (
      <View onLayout={this._onLayout} style={styles.fullScreen}>
        <TouchableOpacity onPress={this._videoEvent} activeOpacity={1}>
          {uri ? (
            <Video
              ref={el => (this.player = el)}
              source={{
                uri: uri,
              }}
              rate={1.0} //播放速度
              volume={1.0} //音量
              muted={false} //是否静音
              paused={!play} //是否暂停
              resizeMode={'contain'} // contain（包含） cover(覆盖) stretch(拉伸)
              playInBackground={false} //后台播放
              playWhenInactive={false} //回到视频时 是否继续播放
              onLoad={this._onLoaded}
              onProgress={this._onProgressChanged}
              // onLoadStart={this._onLoadStart}
              // onEnd={this._onPlayEnd}
              // onError={this._onPlayError}
              // onBuffer={this._onBuffering}
              style={styles.videoFull}
            />
          ) : null}
        </TouchableOpacity>
        {showControl ? (
          <TouchableWithoutFeedback>
            <View style={styles.headerControl}>
              <TouchableOpacity style={styles.goBack} onPress={this._goBack}>
                <Icons name="arrow-back" size={26} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.videoTitle} numberOfLines={1}>
                {title}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ) : null}
        {showControl ? (
          <View style={styles.control}>
            <TouchableOpacity onPress={this._play}>
              <View style={styles.button1}>
                <Icons
                  name={play ? 'pause-circle-outline' : 'play-circle-outline'}
                  size={22}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.time}>{Util.formatTime(currentTime)}</Text>
            <Slider
              style={{flex: 1}}
              thumbTintColor={'#ffffff'}
              maximumTrackTintColor={'#999999'}
              minimumTrackTintColor={'#ffffff'}
              value={currentTime}
              minimumValue={0}
              maximumValue={duration}
              onValueChange={currentTime => {
                this.onSliderValueChanged(currentTime);
              }}
            />
            <Text style={styles.time}>{Util.formatTime(duration)}</Text>
            <TouchableOpacity onPress={this._max}>
              <View style={styles.button2}>
                <Icons
                  name={max ? 'fullscreen-exit' : 'fullscreen'}
                  size={22}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : null}
        {play ? null : (
          <View style={styles.toPlay}>
            <TouchableOpacity onPress={this._play1}>
              <Icons
                name="play-circle-outline"
                size={55}
                color="rgba(255,255,255,0.5)"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

export default Page;
