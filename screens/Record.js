import React, { useState, useEffect } from 'react';
import { View, Button, FlatList, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Asset, useAssets } from 'expo-asset';



const RecordScreen = () => {
    // Déclaration des variables d'état

  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [message, setMessage] = useState("");
  const [assets, error] = useAssets([require('../assets/audio.wav')]);

  // Demande de permission d'accéder à l'audio au chargement du composant
  useEffect(() => {
    Audio.requestPermissionsAsync();
  }, []);

  // Fonction pour démarrer l'enregistrement
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // Fonction pour arrêter l'enregistrement
  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); 
    setRecordings([...recordings, { uri }]);
    setMessage("Recording saved");
  };


    // Fonction pour lire un clip audio
  const playSound = async (uri) => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
  };

    // Fonction pour sauvegarder un enregistrement
  const saveRecording = async (uri, newName) => {
    const newUri = FileSystem.documentDirectory + newName + '.wav';
    await FileSystem.moveAsync({
      from: uri,
      to: newUri,
    });
    setMessage("Recording renamed and saved");
  };

  // Fonction pour supprimer un enregistrement
  const deleteRecording = async (uri) => {
    await FileSystem.deleteAsync(uri);
    setRecordings(recordings.filter(recording => recording.uri !== uri));
    setMessage("Recording deleted");
  };

  // Fonction pour télécharger un fichier depuis un serveur
  const downloadFile = async () => {
    let directory = FileSystem.documentDirectory + "my_directory"
    await FileSystem.makeDirectoryAsync(directory);
    const { uri } = await FileSystem.downloadAsync(serverAdress + "/download", directory + "/hey.wav")
  };

  // Fonction pour envoyer un fichier à un serveur
  const sendFile = async () => {
    let fileUri = assets[0].localUri 
    resp = await FileSystem.uploadAsync(serverAdress + "/upload", fileUri, {
        fieldName: 'file',
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        headers: { filename: fileUri }
    })
    console.log(resp.body)
  };



  // Rendu du composant

  return (
    <View>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <Text>{message}</Text>
      <FlatList
        data={recordings}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => (
          <View>
            <Text>{item.uri}</Text>
            <Button title="Play" onPress={() => playSound(item.uri)} />
            <Button title="Save" onPress={() => saveRecording(item.uri, 'NewRecordingName')} />
            <Button title="Delete" onPress={() => deleteRecording(item.uri)} />
          </View>
        )}
      />
    </View>
  );
};

export default RecordScreen;
