import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInSignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          console.log('Stored user info:', parsedUserInfo);
          setUserInfo(parsedUserInfo);
        }
      } catch (error) {
        console.error('Failed to load user info', error);
      }
    };

    fetchUserInfo();
  }, []);
  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:3000/signin', {
        email,
        password,
      });
      console.log('Sign in response:', response.data);
      setUserInfo(response.data);
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      Alert.alert('Connexion réussie');
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur lors de la connexion', error.response?.data?.error || 'Erreur inconnue');
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:3000/signup', {
        email,
        password,
      });
      Alert.alert('Enregistrement réussi');
      setIsSignIn(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur lors de l\'enregistrement', error.response?.data?.error || 'Erreur inconnue');
    }
  };

  const handleSignOut = async () => {
    setUserInfo(null);
    await AsyncStorage.removeItem('userInfo');
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View>
          <Text style={styles.info}>Bienvenue , {userInfo}</Text>
          <Text style={styles.info}>ID: {userInfo.id}</Text>
          <Button title="Deconnexion" onPress={handleSignOut} />
        </View>
      ) : (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {isSignIn ? (
            <Button title="Sign In" onPress={handleSignIn} />
          ) : (
            <Button title="Sign Up" onPress={handleSignUp} />
          )}
          <Text style={styles.switchText} onPress={() => setIsSignIn(!isSignIn)}>
            {isSignIn ? 'Créer un compte' : 'Se connecter'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  switchText: {
    color: 'blue',
    marginTop: 10,
    textAlign: 'center',
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default SignInSignUpScreen;
