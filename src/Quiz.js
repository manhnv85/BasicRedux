import React, {Component} from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    PanResponder
} from 'react-native';

var {width, height} = Dimensions.get('window');

var items = [
    {word: "Hello"},
    {word: "You."},
    {word: "How"},
    {word: "are"},
    {word: "Go"},
    {word: "They"},
     {word: "Where"}
]

class Quiz extends Component{

    constructor(props){
        super(props);
        this.state = {
            pan: new Animated.ValueXY(),

        }
        this.top =0;
        this.left = 0;
        this.view = null;
        this.customStyle = {
            style: {
                top: this.top,
                left: this.left
            }
        }
        
    }

    componentWillMount(){
        this.panResponder = PanResponder.create({    //Step 2
            onStartShouldSetPanResponder : (event, gestureState) => true,
            onMoveShouldSetPanResponder : (event, gestureState) => true,
            // onPanResponderMove           : Animated.event([null,{ //Step 3
            //     dx : this.state.pan.x,
            //     dy : this.state.pan.y
            // }]),
            onPanResponderMove: this._onPanResponderMove.bind(this),
            onPanResponderRelease        : this._onPanResponderRelease.bind(this)
        });
    }

    _onPanResponderRelease(event, gestureState){
        this.top += gestureState.dy;
        this.left += gestureState.dx;
    }

    updateNativeProps(){
        this.view && this.view.setNativeProps(this.customStyle);
    }

    _onPanResponderMove(event, gestureState){
        this.customStyle.style.top = this.top + gestureState.dy;
        this.customStyle.style.left = this.left + gestureState.dx;
        this.updateNativeProps();
    }

    shuffle(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
    }

    

    render(){
        const arr = [];
        this.shuffle(items);
        items.map((item, i) => {
            var x = item.word;
            arr.push(
                <View key={i} style={styles.bg_text}>
                    <Animated.View
                     ref={view => this.view =view}
                    {...this.panResponder.panHandlers}
                     style={[this.state.pan.getLayout(), styles.bg_text_in]}>
                        <Text style={styles.text}>{item.word}</Text>
                    </Animated.View>
                </View>
            )
        })
        return(
            <View style={styles.container}>
                <View style={styles.top}></View>
                <View style={styles.content}>
                    {arr}
                    <View
                   
                     style={{backgroundColor: 'red', width: 100, height: 100}}></View>
                </View>
            </View>
        );
    }
}

export default Quiz;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    top: {
        backgroundColor: '#ccc',
        width: width - (width * .1),
        height: height - (height * 0.5)
    },
    content: {
        width: width - (width * .1),
        height: height - (height * 0.5),
        backgroundColor: '#222',
        flexDirection: 'row',
        flexWrap:'wrap'
    },
    bg_text: {
        backgroundColor: '#eee',
        alignSelf: 'stretch',
        margin: 10,
        height: 30,
        justifyContent: 'center'
    },
    bg_text_in: {
        backgroundColor: 'blue',
        height: 30,
        padding: 5,
        justifyContent: 'center',
        zIndex: 1
    },
    text: {
        color: 'red',
        fontSize: 20
    }
});