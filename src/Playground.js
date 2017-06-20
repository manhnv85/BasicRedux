import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  PanResponder,
  Animated,
  Alert,
} from 'react-native';
import _ from 'lodash';

class Draggable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1),
      zIndex: 0,
      backgroundColor: 'white',
    };
  }

  handleOnLayout(event) {
    const { addDropzone } = this.props;
    const { layout } = event.nativeEvent;
    this.layout = layout;
    addDropzone(this, layout);
  }

  componentWillMount() {
    const { inDropzone, swapItems, index } = this.props;

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, gestureState) => {
        console.log('moving', index);
        this.state.pan.setOffset({ x: this.state.pan.x._value, y: this.state.pan.y._value });
        this.state.pan.setValue({ x: 0, y: 0 });

        Animated.spring(this.state.scale, { toValue: 0.75, friction: 3 }).start();

        this.setState({ backgroundColor: 'deepskyblue', zIndex: 1 });
      },

      onPanResponderMove: Animated.event([null, { dx: this.state.pan.x, dy: this.state.pan.y }]),

      onPanResponderRelease: (e, gesture) => {
        this.state.pan.flattenOffset();
        Animated.spring(this.state.scale, { toValue: 1 }).start();
        this.setState({ backgroundColor: 'white', zIndex: 0 });

        let dropzone = inDropzone(gesture);
        if (dropzone) {
          console.log('in dropzone', dropzone.index);
          // adjust into place
          Animated.spring(this.state.pan, { toValue: {
            x: dropzone.x - this.layout.x,
            y: dropzone.y - this.layout.y,
          } }).start();
          if (index !== dropzone.index) {
            swapItems(index, dropzone.index);
          }
        }
        Animated.spring(this.state.pan, { toValue: { x: 0, y: 0 } }).start();
      }

    });
  }

  render() {
    const { pan, scale, zIndex, backgroundColor } = this.state;
    const [translateX, translateY] = [pan.x, pan.y];
    const rotate = '0deg';
    const imageStyle = {
      transform: [{ translateX }, { translateY }, { rotate }, { scale }],
    };

    return (
      <View
        style={[styles.dropzone, { zIndex }]}
        onLayout={event => this.handleOnLayout(event)}
      >
        <Animated.View
          {...this._panResponder.panHandlers}
          style={[imageStyle, styles.draggable, { backgroundColor }]}
        >
          <Image style={styles.image} source={{ uri: this.props.item }} />
        </Animated.View>
      </View>
    );
  }
}

const swap = (array, fromIndex, toIndex) => {
  const newArray = array.slice(0);
  newArray[fromIndex] = array[toIndex];
  newArray[toIndex] = array[fromIndex];
  return newArray;
}

class Playground extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [
        'https://files.graphiq.com/465/media/images/t2/Shiba_Inu_5187048.jpg',
        'https://i.ytimg.com/vi/To8oesttqc4/hqdefault.jpg',
        'https://vitaminsforpitbulls.com/wp-content/uploads/2013/06/english-bulldog-puppy-for-sale-909x1024.jpg',
        'https://s-media-cache-ak0.pinimg.com/236x/20/16/e6/2016e61e8642c8aab60c71f6e3bcd004.jpg',
        'https://pbs.twimg.com/profile_images/446566229210181632/2IeTff-V.jpeg',
        'https://s-media-cache-ak0.pinimg.com/236x/fa/7b/18/fa7b185924d9d4d14a0623bc567f4e87.jpg',
      ],
      dropzones: [],
      dropzoneLayouts: [],
    };
  }

  addDropzone(dropzone, dropzoneLayout) {
    const { items, dropzones, dropzoneLayouts } = this.state;
    // HACK: to make sure setting state does not re-add dropzones
    if (items.length !== dropzones.length) {
      this.setState({
        dropzones: [...dropzones, dropzone],
        dropzoneLayouts: [...dropzoneLayouts, dropzoneLayout],
      });
    }
  }

  inDropzone(gesture) {
    const { dropzoneLayouts } = this.state;
    // HACK: with the way they are added, sometimes the layouts end up out of order, so we need to sort by y,x (x,y doesn't work)
    const sortedDropzoneLayouts = _.sortBy(dropzoneLayouts, ['y', 'x']);
    let inDropzone = false;

    sortedDropzoneLayouts.forEach((dropzone, index) => {
      const inX = gesture.moveX > dropzone.x && gesture.moveX < dropzone.x + dropzone.width;
      const inY = gesture.moveY > dropzone.y && gesture.moveY < dropzone.y + dropzone.height;
      if (inX && inY) {
        inDropzone = dropzone;
        inDropzone.index = index;
      }
    });
    return inDropzone;
  }

  swapItems(fromIndex, toIndex) {
    console.log('swapping', fromIndex, '<->', toIndex);
    const { items, dropzones } = this.state;
    this.setState({
      items: swap(items, fromIndex, toIndex),
      dropzones: swap(dropzones, fromIndex, toIndex),
    });
  }

  render() {
    console.log(this.state);
    return (
      <View style={styles.container}>
        {this.state.items.map((item, index) =>
          <Draggable key={index}
            item={item}
            index={index}
            addDropzone={this.addDropzone.bind(this)}
            inDropzone={this.inDropzone.bind(this)}
            swapItems={this.swapItems.bind(this)}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dropzone: {
    // margin: 5,
    zIndex: -1,
    width: 106,
    height: 106,
    borderColor: 'green',
    borderWidth: 3,
    backgroundColor: 'lightgreen',
  },
  draggable: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: 'black'
  },
  image: {
    width: 75,
    height: 75
  }
});

export default Playground;