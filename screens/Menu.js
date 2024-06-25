// screens/Menu.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Menu = ({ navigation }) => {
    // Rend l'interface utilisateur

  return (
    <View style={styles.container}>
      <Button
        title="RAVE"
        onPress={() => navigation.navigate('Rave')}
        color="red"
      />
      <Button
        title="Record"
        onPress={() => navigation.navigate('Record')}
        color="blue"
      />
    </View>
  );
};

// Styles pour le composant

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default Menu;
