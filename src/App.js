import React, {Component} from 'react';

import {
    View,
    Text,
    Animated,
    Dimensions,
    StyleSheet,
    PanResponder,
    StatusBar
} from 'react-native';

import {Provider} from 'react-redux';
import store from './configStore';
import Hello from './components/Hello';

import Employee from './components/Employee';

const {width, height} = Dimensions.get('window');
let CIRCLE_RADIUS = 160;
let AUDIO_SIZE = 60;
let Window = Dimensions.get('window');
import Quiz from './Quiz';
import Sample from './sample';

export default class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            animate: new Animated.Value(30),
            animateXY: new Animated.ValueXY({x: 0, y: 0}),
            radius: new Animated.Value(0),
            pan: new Animated.ValueXY(),
            dropZoneValues: null,
            showDrraggable: true,
            dropZoneValues_top: null
        }

        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, {
                //dx: this.state.pan.x,
                dy: this.state.pan.y
            }]),
            onPanResponderRelease : (e, getture) => {
                if(this.isDropZone(getture)){
                    this.setState({showDrraggable: false});
                }
                else{
                    Animated.spring(
                        this.state.pan,
                        {
                            toValue:{x: 0, y: 0}
                        }
                    ).start();
                }
                
            }
        })
    }

    isDropZone(getture){
        var dz = this.state.dropZoneValues;
        var dz_top = this.state.dropZoneValues_top;
        //return getture.moveY > dz.y && getture.moveY < dz.y + dz.height;
        return getture.moveY+80 >= dz.y || getture.moveY-80 >= dz_top.y && getture.moveY-80 <= dz_top.y + dz_top.height;
    }

    componentWillMount(){
        Animated.sequence([
            Animated.timing(this.state.animateXY, {
                toValue: {x: height / 2, y: 0},
                duration:63000
            }),
            Animated.timing(this.state.animate, {
                toValue: 60,
                duration: 6000
            }),
            Animated.timing(this.state.radius, {
                toValue: 40,
                duration: 2000
            })
        ]).start();

        
    }

    renderDraggable(){
        return (
            <View style={styles.draggableContainer}>
                <Animated.View 
                {...this.PanResponder.panHandlers}
                style={[this.state.pan.getLayout(), styles.circle]}
                >
                    <Text style={styles.text}>Drag me!</Text>
                </Animated.View>
            </View>
        );
    }

    setDropZoneValues(event){
        this.setState({dropZoneValues: event.nativeEvent.layout})
    }

    setDropZoneValues_top(event){
        this.setState({dropZoneValues_top: event.nativeEvent.layout})
    }

    render3(){
        return(
            <Sample />
        );
    }

    render(){
        return(
            <Quiz />
        );
    }

    render2(){
        return(
            <View style={styles.mainContainer}>
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"
                    hidden={true}
                />
                <View 
                    onLayout={this.setDropZoneValues_top.bind(this)}
                style={[{flex: 1},styles.dropZone]}>
                    <Text style={styles.text}>Drop me here!</Text>
                </View>
                <View style={{flex: 6}}></View>
                <View 
                    onLayout={this.setDropZoneValues.bind(this)}
                style={[{flex: 1},styles.dropZone]}>
                    <Text style={styles.text}>Drop me here!</Text>
                </View>
                <View style={styles.audio}>
                    <Text style={styles.audio_text}>Play</Text>
                </View>
                {this.renderDraggable()}
            </View>
        );
        /*return(
            <Provider store={store}>
                <View style={{flex: 1}}>
                    <Employee />
                </View>
            </Provider>
        )*/
    }
}

let styles = StyleSheet.create({
    mainContainer: {
        flex    : 1
    },
    dropZone    : {
        backgroundColor:'#2c3e50'
    },
    text        : {
        marginTop   : 25,
        marginLeft  : 5,
        marginRight : 5,
        textAlign   : 'center',
        color       : '#fff'
    },
    draggableContainer: {
        position    : 'absolute',
        top         : Window.height/2 - CIRCLE_RADIUS,
        left        : Window.width/2 - CIRCLE_RADIUS,
    },
    circle      : {
        backgroundColor     : '#1abc9c',
        width               : CIRCLE_RADIUS*2,
        height              : CIRCLE_RADIUS*2,
        //borderRadius        : CIRCLE_RADIUS
    },
    audio: {
        backgroundColor: 'red',
        position: 'absolute',
        top: (Window.height - AUDIO_SIZE)/2,
        right: 0,
        height: AUDIO_SIZE,
        width: AUDIO_SIZE,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    audio_text: {
        color: '#fff',
        fontSize: 18
    }
});