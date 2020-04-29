import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

class Control extends React.Component {
  render() {
    return (
      <>
        {this.props.loading ? (
          <View style={styles.loading}>
            <View style={styles.loadingBg}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>加载中</Text>
            </View>
          </View>
        ) : null}
      </>
    );
  }
}
const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1001,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBg: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    width: 120,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 10,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
    paddingTop: 10,
  },
});
export default Control;
