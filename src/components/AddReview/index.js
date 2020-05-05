import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Animated,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import HTTP from '../../script/request';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {_set_public_loading} from '../../script/action';

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  postFix: {
    position: 'absolute',
    zIndex: 10000,
    width: width,
    height: height,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    backgroundColor: '#fff',
    width: width,
    height: height * 0.8,
    position: 'absolute',
    left: 0,
    padding: 10,
  },
  TextInput: {
    flex: 1,
    textAlignVertical: 'top',
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  close: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 2,
    paddingRight: 12,
  },
  headerTitle: {
    color: '#000',
    fontSize: 16,
    lineHeight: 30,
  },
  headerSubmit1: {
    backgroundColor: '#ccc',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 3,
  },
  headerSubmitText1: {
    color: '#999',
  },
  headerSubmit: {
    backgroundColor: '#fd6655',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 3,
  },
  headerSubmitText: {
    color: '#fff',
  },
});
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      content: null,
    };
    this.calHeight = new Animated.Value(parseInt(height));
  }
  _changeVisible = () => {
    this.textInputElement.blur();
    setTimeout(() => {
      Animated.timing(this.calHeight, {
        toValue: parseInt(height),
        duration: 500,
      }).start(() => {
        this.props._showAddReview(false);
      });
    }, 500);
  };
  componentDidMount() {
    Animated.timing(this.calHeight, {
      toValue: 160,
      duration: 300,
    }).start();
    this.textInputElement.focus();
  }
  //输入
  _changeContent = text => {
    this.setState({
      content: text,
    });
  };
  //提交
  _onSubmit = () => {
    const {content} = this.state;
    if (!content) return false;
    _set_public_loading(true);
    HTTP.post('/v2/api/mobile/bookReview/addReview', {
      book_id: this.props.book_id,
      review_content: content,
    }).then(res => {
      if (res.code == 0) {
        ToastAndroid.showWithGravity(
          '评论成功!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        this.props._resetReviews();
        this._changeVisible();
      } else {
        ToastAndroid.showWithGravity(
          res.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
      _set_public_loading(false);
    });
  };
  render() {
    const {visible, content} = this.state;
    return (
      <TouchableOpacity
        style={styles.postFix}
        activeOpacity={1}
        onPress={this._changeVisible}>
        {visible ? (
          <TouchableWithoutFeedback>
            <Animated.View
              style={{
                top: this.calHeight,
                backgroundColor: '#fff',
                width: width,
                height: height * 0.8,
                position: 'absolute',
                left: 0,
                padding: 10,
              }}>
              <View style={styles.barHeader}>
                <TouchableOpacity
                  style={styles.close}
                  onPress={this._changeVisible}>
                  <AntDesign
                    name="close"
                    size={20}
                    color="#787878"
                    style={styles.unIcon}
                  />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>写评论</Text>
                <TouchableOpacity
                  onPress={this._onSubmit}
                  style={content ? styles.headerSubmit : styles.headerSubmit1}
                  activeOpacity={0.8}>
                  <Text
                    style={
                      content
                        ? styles.headerSubmitText
                        : styles.headerSubmitText1
                    }>
                    提交
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.TextInput}
                blurOnSubmit={false}
                multiline={true}
                fontSize={16}
                onChangeText={this._changeContent}
                ref={el => (this.textInputElement = el)}
                placeholder="填写你的评论内容..."
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        ) : null}
      </TouchableOpacity>
    );
  }
}
