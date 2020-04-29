import React from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Icons from 'react-native-vector-icons/Ionicons';
import Home from './home';

const Stack = createStackNavigator();
const headerRight = (navigation) => {
  return (
    <View>
      <Icons
        name="md-search"
        style={{paddingRight: 15, paddingLeft: 15, paddingTop: 5}}
        size={25}
        color="#999"
        onPress={(e) => {
          navigation.navigate('Search');
        }}
      />
    </View>
  );
};
class Page extends React.Component {
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
              headerRight: headerRight.bind(this, navigation),
            };
          }}
        />
      </Stack.Navigator>
    );
  }
}
export default Page;
