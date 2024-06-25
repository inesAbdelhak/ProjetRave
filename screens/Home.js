// screens/Home.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const Home = ({ navigation }) => {
    // États pour stocker l'adresse IP du serveur et le port
  const [serverIp, setServerIp] = useState('');
  const [port, setPort] = useState('');

  // Fonction pour se connecter au serveur
  const connectToServer = async () => {
    const url = `http://${serverIp}:${port}/`;
    try {
      // Effectue une requête GET à l'URL spécifiée
      const response = await axios.get(url);
      // Affiche une alerte de succès et navigue vers l'écran Menu
      Alert.alert('Connexion réussie', response.data, [
        { text: 'OK', onPress: () => navigation.navigate('Menu') },
      ]);
    } catch (error) {
      // Affiche une alerte en cas d'erreur
      Alert.alert('Erreur', 'Connexion indisponible : ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter server IP"
        value={serverIp}
        onChangeText={setServerIp}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter port"
        value={port}
        onChangeText={setPort}
      />
      <Button
        title="Connect"
        onPress={connectToServer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 8,
  },
});

export default Home;
