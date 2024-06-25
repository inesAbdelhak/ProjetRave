// screens/RAVE.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import axios from 'axios';

// Création du navigateur à onglets
const Tab = createMaterialTopTabNavigator();

// Composant pour sélectionner le son par défaut
const DefaultSound = ({ onSelect }) => {
  const selectDefaultSound = async () => {
    const asset = require('../assets/audio.wav');
    onSelect(asset);
  };

  return (
    <View style={styles.tabContainer}>
      <Button title="Select Default Sound" onPress={selectDefaultSound} />
    </View>
  );
};
// Composant pour afficher les enregistrements disponibles

const Recordings = ({ recordings, onSelect }) => {
  return (
    <View style={styles.tabContainer}>
      {recordings.length > 0 ? (
        recordings.map((recording, index) => (
          <Button key={index} title={`Recording ${index + 1}`} onPress={() => onSelect(recording)} />
        ))
      ) : (
        <Text>No recordings available</Text>
      )}
    </View>
  );
};
// Composant pour sélectionner un fichier audio depuis le système de fichiers

const FilePicker = ({ onSelect }) => {
  const pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    if (result.type === 'success') {
      onSelect(result.uri);
    }
  };

  return (
    <View style={styles.tabContainer}>
      <Button title="Select Audio File" onPress={pickFile} />
    </View>
  );
};

// Composant principal pour l'écran RAVE

const RAVE = ({ navigation }) => {
  const [selectedSound, setSelectedSound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transformedSoundUri, setTransformedSoundUri] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordings, setRecordings] = useState([]);



  // Chargement des enregistrements au montage du composant
  useEffect(() => {
    
    const loadRecordings = async () => {
   
    };

    loadRecordings();
  }, []);

    // Fonction pour uploader et transformer le son

  const uploadAndTransformSound = async () => {
    if (!selectedSound) {
      Alert.alert('Error', 'Please select a sound first');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedSound,
        type: 'audio/wav',
        name: 'audio.wav',
      });

      const response = await axios.post('http://192.168.1.15:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data === 'File uploaded successfully') {
        const downloadResponse = await axios.get('http://192.168.1.15:8000/download', {
          responseType: 'arraybuffer',
        });

        const transformedUri = FileSystem.documentDirectory + 'transformed_audio.wav';
        await FileSystem.writeAsStringAsync(transformedUri, downloadResponse.data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        setTransformedSoundUri(transformedUri); // Met à jour l'URI du son transformé
        Alert.alert('Success', 'Sound transformed successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload and transform sound');
    } finally {
      setIsLoading(false); // Arrête l'indicateur de chargement
    }
  };

  const playSound = async (uri) => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
    await sound.playAsync();
  };
    // Déchargement du son au démontage du composant

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

    // Interface utilisateur

  return (
    <View style={styles.container}>
      <Tab.Navigator>
        <Tab.Screen name="Default Sound">
          {() => <DefaultSound onSelect={setSelectedSound} />}
        </Tab.Screen>
        <Tab.Screen name="Recordings">
          {() => <Recordings recordings={recordings} onSelect={setSelectedSound} />}
        </Tab.Screen>
        <Tab.Screen name="File Picker">
          {() => <FilePicker onSelect={setSelectedSound} />}
        </Tab.Screen>
      </Tab.Navigator>

      <Button title="Upload and Transform" onPress={uploadAndTransformSound} />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      <Button title="Play Original Sound" onPress={() => playSound(selectedSound)} disabled={!selectedSound} />
      <Button title="Play Transformed Sound" onPress={() => playSound(transformedSoundUri)} disabled={!transformedSoundUri} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
  },
  tabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RAVE;
