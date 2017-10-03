import React from 'react';
import { View, Text, Animated, PanResponder, Dimensions, LayoutAnimation } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { UIManager } from 'NativeModules';

// fix for Android
UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_DURATION = 250;
const DIRECTIONS = {
  RIGHT: 'right',
  LEFT: 'left'
}

export default class Deck extends React.Component {
  constructor(props) {
    super(props);

    this._position = new Animated.ValueXY();

    this._panResponder = PanResponder.create({
      // anytime user tap on the screen,
      // is this panResponder to be responsible for handling touch
      onStartShouldSetPanResponder: () => true,

      // this will be call everytime user touch and drag the elemnent
      onPanResponderMove: this._onPanResponderMove,

      // to be callec when user release
      onPanResponderRelease: this._onPanResponderRelease
    })

    this.state = {
      currentCardIndex: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data !== this.props.data) {
      this.setState({
        currentCardIndex: 0
      })
    }
  }

  componentWillUpdate() {
    // to have a nice bump up when component re-render
    LayoutAnimation.spring();
  }

  _onPanResponderMove = (event, gesture) => {
    const { dx, dy } = gesture;

    // update position object manually
    this._position.setValue({
      x: dx,
      y: dy
    })
  }

  _onPanResponderRelease = (event, gesture) => {
    const { dx } = gesture;
    if (dx > SWIPE_THRESHOLD) {
      this._forceSwipe(DIRECTIONS.RIGHT);
    } else if (dx < -SWIPE_THRESHOLD) {
      this._forceSwipe(DIRECTIONS.LEFT);
    } else {
      this._resetCardPosition();
    }
  }

  _resetCardPosition = () => {
    Animated.spring(this._position, {
      toValue: {
        x: 0,
        y: 0
      }
    }).start();
  }

  _forceSwipe = (direction) => {
    const afterSwipePosition = direction === DIRECTIONS.RIGHT ? SCREEN_WIDTH : -SCREEN_WIDTH;

    Animated.timing(this._position, {
      toValue: { x: afterSwipePosition, y: 0 },
      duration: SWIPE_DURATION
    }).start(() => { this._onSwipeCompleted(direction) })
  }

  _onSwipeCompleted = (direction) => {
    // reset next card position
    this._position.setValue({ x: 0, y: 0 });

    // increase the index of the card that will receive panResponse
    this.setState({
      currentCardIndex: this.state.currentCardIndex + 1
    })
  }

  _renderCard = (card) => <Card
    image={{ uri: card.uri }}
  >
    <Text style={{ marginBottom: 10 }}>{card.text}</Text>
    <Button
      icon={{ name: 'code' }}
      backgroundColor="#03A9F4"
      title="View now"
    />
  </Card>

  _getCardLayout = () => {
    const { _position: position } = this;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    })
    return {
      ...position.getLayout(),
      // TODO: why we can put tranform here???
      transform: [{ rotate }]
    }
  }

  render() {
    const { data } = this.props;
    const { currentCardIndex } = this.state;
    if(currentCardIndex === data.length) {
      return <Text>No more card to render</Text>
    }

    return <View>
      {
        data.map((card, index) => {
          if (index < currentCardIndex ) {
            // not render the swiped away card
            return null;
          }
          if(index === currentCardIndex) {
            // only 1st card get panResponse handlers
            return <Animated.View
              key={card.id}
              style={[this._getCardLayout(), styles.cardStyles]}
              { ...this._panResponder.panHandlers }
            >
             {this._renderCard(card)}
            </Animated.View>
          }
          return <Animated.View key={card.id} style={[styles.cardStyles, { top: (index - currentCardIndex) * 10 }]}>
            {this._renderCard(card)}
          </Animated.View>
        }).reverse()
        // to render the 1st card on top
      }
    </View>
  }
}

const styles = {
  cardStyles: {
    position: 'absolute',
    width: SCREEN_WIDTH,
  }
}