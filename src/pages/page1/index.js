import React from 'react';
import store from '../../script/store'
import { _show_modal } from '../../script/action'

import { View, Text, Button } from 'react-native'

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          base: store.getState(),
        };
        store.subscribe(this.storeChange);
      }
      //更新store
      storeChange = () => {
        this.setState({
          base: store.getState(),
        }, () => {
          console.log('公共数据变更', this.state.base)
        });
      };
      componentWillUnmount() {
        this.setState = () => {
          return;
        };
      }
    render() {
        return (<View>
            <Text>子页面获取公共数据: {this.state.base.name}</Text>
            <View>
                <Button title='打开公共组件' onPress={_show_modal} />
            </View>
        </View>)
    }
}
export default Page;
