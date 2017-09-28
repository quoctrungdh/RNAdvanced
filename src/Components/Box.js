import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';

export default class Box extends React.Component {
  componentWillMount() {
    this.position = new Animated.ValueXY(0, 0);
    Animated.spring(this.position, {
      toValue: { x: 200, y: 500 }
    }).start();
  }
  render() {
    return <Animated.View style={this.position.getLayout()}>
      <View style={styles.box} />
    </Animated.View>
  }
}

const styles = StyleSheet.create({
  box: {
    width: 30,
    borderWidth: 30,
    borderColor: '#000',
    borderRadius: 30,
  }
});
