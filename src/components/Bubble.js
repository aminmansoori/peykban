import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    position: 'absolute',
    bottom: hp('1.5%'),
    left: wp('5%'),
    right: wp('5%'),
    paddingVertical: hp('2%'),
    minHeight: 60,
    justifyContent: 'center',
    backgroundColor: '#fff0',
  },
});

class Bubble extends React.PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
  };

  render() {
    let innerChildView = this.props.children;

    if (this.props.onPress) {
      innerChildView = (
        <TouchableOpacity onPress={this.props.onPress}>
          {this.props.children}
        </TouchableOpacity>
      );
    }

    return (
      <View style={[styles.container, this.props.style]}>{innerChildView}</View>
    );
  }
}

export default Bubble;
