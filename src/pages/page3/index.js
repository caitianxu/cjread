import React from 'react';
import { _show_modal } from '../../script/action'

import { View, Text, Button } from 'react-native'

class Page extends React.Component {
    render() {
        return (<View>
            <Text>this is page3</Text>
            <View>
                <Button title='打开公共组件' onPress={_show_modal} />
            </View>
        </View>)
    }
}
export default Page;
