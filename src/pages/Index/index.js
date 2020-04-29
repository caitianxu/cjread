import React from 'react';
import {View, Text, Button} from 'react-native';

class Page extends React.Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>index</Text>
        <Button
          title="Go to Details"
          onPress={() => {
            this.props.navigation.navigate('Setting', {
              itemId: 86,
              otherParam: 'anything you want here',
            });
          }}
        />
      </View>
    );
  }
}
export default Page;
