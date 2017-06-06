import React, {Component} from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import {connect} from 'react-redux';
// import {getData} from '../actions';
import {fetchData} from '../actions';

class Employee extends Component{

    componentWillMount(){
        //this.props.getData();
    }

    render(){
        console.log(this.props);
        return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.button}
                    onPress={() => this.props.fetchData()}
                >
                    <Text>Click Me</Text>
                </TouchableOpacity>
                <View style={styles.content}>
                    {
                        this.props.data.isFetching && <Text>Loading...</Text>
                    }
                    {
                        this.props.data.data.length  ? (
                            this.props.data.data.map((item, i) => {
                                return <View key={i}><Text>Name: {item.name}  {item.edu}</Text></View>
                            })
                        ) :
                        null
                    }
                </View>
            </View>
        )
    }
}

const mapStateToProps=(state) => {
    //console.log("state: ",state);
    return{
        data: state.reducerFetch
    }
}

export default connect(mapStateToProps, {fetchData})(Employee)

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'aqua',
        height: 50,
        margin: 20,
        borderRadius: 10
    },
    content: {

    }
})
