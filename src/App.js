import React, {Component} from 'react';

import {
    View,
    Text
} from 'react-native';

import {Provider} from 'react-redux';
import store from './configStore';
import Hello from './components/Hello';
export default class App extends Component{
    render(){
        return(
            <Provider store={store}>
                <View style={{flex: 1}}>
                    <Hello />
                </View>
            </Provider>
        )
    }
}