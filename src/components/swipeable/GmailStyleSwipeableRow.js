import React, { Component } from 'react';
import { Animated, StyleSheet, Alert, I18nManager } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RectButton } from 'react-native-gesture-handler';
import { removeTrackAction } from '../../Actions/TrackAction';
import { connect } from 'react-redux';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      id: this.props.id
    };
  }

  renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    removeTrack = () => {
      Alert.alert(
        "حذف سفر",
        "آیا از حذف سفر خود مطمئن هستید؟",
        [{ text: "لغو", onPress: () => { this.close() } },
        {
          text: "تایید", onPress: () => {
            this.props.removeTrackAction(this.props.name, this.props.id)
            this.close()
          }
        }],
        { cancelable: false }
      );
    }

    return (
      <RectButton style={styles.rightAction}
        onPress={() => removeTrack()}>
        <AnimatedIcon
          name="delete-forever"
          size={30}
          color="#fff"
          style={[styles.actionIcon, { transform: [{ scale }] }]}
        />
      </RectButton >
    );
  };

  updateRef = ref => {
    this._swipeableRow = ref;
  };

  close = () => {
    this._swipeableRow.close();
  };

  render() {
    const { children } = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        leftThreshold={80}
        rightThreshold={40}
        renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}>
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#388e3c',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse'
  },
  actionIcon: {
    width: 30,
  },
  rightAction: {
    alignItems: 'center',
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    backgroundColor: '#dd2c00',
    width: '20%',
    justifyContent: 'center'
  }
});

export default connect(null, { removeTrackAction })(App);