import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackedCards } from './ui/components/StackedCards';
import data from './data'

const CARDS = data;

export default function App() {
  return (
    <View style={styles.container}>
      <StackedCards items={CARDS} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
