import React from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { Card, Button } from 'react-native-elements';

import Box from './src/Components/Box.js';
import Deck from './src/Components/Deck.js'

const DATA = [
  { id: 1, text: 'Title#01', uri: 'https://unsplash.it/320/200'},
  { id: 2, text: 'Title#02', uri: 'https://unsplash.it/320/200'},
  { id: 3, text: 'Title#03', uri: 'https://unsplash.it/320/200'},
  { id: 4, text: 'Title#04', uri: 'https://unsplash.it/320/200'},
  { id: 5, text: 'Title#05', uri: 'https://unsplash.it/320/200'},
  { id: 6, text: 'Title#06', uri: 'https://unsplash.it/320/200'},
];

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {/* {<Box />} */}
        <Deck data={DATA} />
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
