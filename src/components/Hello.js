import React, {Component} from 'react';

import {
    View,
    Text
} from 'react-native';

import {connect} from 'react-redux';
import {getData} from '../actions';

class Hello extends Component{

    componentWillMount(){
        this.props.getData();
    }

    render(){
        {console.log(this.props)}
        return(
            <View style={{flex: 1}}>
                <Text>{this.props.data.name}</Text>
                <Text>{this.props.data.age}</Text>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    console.log("state", state);
    return {
        data: state.reducerEmployee
    }
}

export default connect(mapStateToProps, {getData})(Hello)