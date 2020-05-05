import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import store from '../../script/store';

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
    };
    store.subscribe(this.storeChange);
  }
  componentDidMount() {}
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

  render() {
    return (
      <View style={styles.safeAreaView}>
        <Text> login Page </Text>
      </View>
    );
  }
}

export default Page;
