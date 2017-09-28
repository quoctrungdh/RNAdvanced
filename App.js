import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';

import Box from './src/Components/Box.js';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Box />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});
