import React, { memo } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import { theme } from '../core/theme';

const Background = ({ children }) => (
  <View
    style={styles.background}
  >
    <StatusBar barStyle="dark-content" backgroundColor = '#fff'/>
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {children}
    </KeyboardAvoidingView>
  </View>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(Background);
