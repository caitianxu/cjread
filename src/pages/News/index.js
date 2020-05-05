import React from 'react';
import {WebView} from 'react-native-webview';
import {View, Dimensions, StatusBar, StyleSheet} from 'react-native';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    StatusBar.setTranslucent(false);
  }
  componentWillUnmount() {
    StatusBar.setTranslucent(true);
  }
  render() {
    const {width, height} = Dimensions.get('window');
    const uri =
      'http://mc.m.5read.com/other/webapp4Rss_webApp4Rss_rssCataList2.jspx?schoolid=12653&uid=12653';
    const styles = StyleSheet.create({
      safeAreaView: {
        flex: 1,
        backgroundColor: '#FFFFFF',
      },
    });
    return (
      <View style={styles.safeAreaView}>
        <WebView source={{uri: uri}} />
      </View>
    );
  }
}

export default Page;
