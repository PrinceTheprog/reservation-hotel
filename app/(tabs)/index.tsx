import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, Image, Alert } from 'react-native';
import axios from 'axios';

interface Hotel {
  id: number;
  name: string;
  address: string;
  city: string;
  rating: string;
  level: string;
  priceDiscounted: string;
  priceOriginal: string;
  roomType: string;
  bedInfo: string;
  deal: string;
  imageUrl: string;
}

const App = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    axios.get('http://localhost:3000/hotels')
      .then(response => {
        setHotels(response.data);
      })
      .catch(error => {
        console.error('Il y a eu une erreur!', error);
      });
  }, []);

  const filterHotels = () => {
    if (!search) {
      return hotels;
    }

    return hotels.filter(hotel =>
      hotel.level.toLowerCase().includes(search.toLowerCase()) ||
      hotel.address.toLowerCase().includes(search.toLowerCase()) ||
      hotel.priceOriginal.toString().toLowerCase().includes(search.toLowerCase())
    );
  };

  const handleReservation = () => {
    if (selectedHotel && startDate && endDate) {
      const userEmail = 'p@gmail.com'; // Remplacez ceci par l'email de l'utilisateur connecté

      axios.post('http://localhost:3000/reservations', {
        user_email: userEmail,
        hotel_id: selectedHotel.id,
        start_date: startDate,
        end_date: endDate,
      })
        .then(response => {
          Alert.alert('Réservation réussie', `Réservation pour l'hôtel ${selectedHotel.name} du ${startDate} au ${endDate}`);
          setStartDate('');
          setEndDate('');
          setSelectedHotel(null);
        })
        .catch(error => {
          console.error('Erreur lors de la réservation', error);
          Alert.alert('Erreur lors de la réservation', error.response?.data?.error || 'Erreur inconnue');
        });
    } else {
      Alert.alert('Veuillez sélectionner un hôtel et entrer les dates de début et de fin');
    }
  };

  const renderItem = ({ item }: { item: Hotel }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.level}>{item.level}</Text>
        </View>
        <Text style={styles.address}>{item.address}</Text>
        <Text style={styles.priceOriginal}>₹{item.priceOriginal}</Text>
        <Text style={styles.priceDiscounted}>₹{item.priceDiscounted}</Text>
        <Text style={styles.roomType}>{item.roomType}</Text>
        <Text style={styles.bedInfo}>{item.bedInfo}</Text>
        <Text style={styles.dealButton}>{item.deal}</Text>
        <Button title="Réserver" onPress={() => setSelectedHotel(item)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Liste des chambres disponibles</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher par niveau, adresse ou prix original"
        value={search}
        onChangeText={setSearch}
      />
      {selectedHotel && (
        <View style={styles.reservationForm}>
          <Text style={styles.reservationHeader}>Réserver {selectedHotel.name}</Text>
          <TextInput
            style={styles.input}
            placeholder="Date de début (AAAA-MM-JJ)"
            value={startDate}
            onChangeText={setStartDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Date de fin (AAAA-MM-JJ)"
            value={endDate}
            onChangeText={setEndDate}
          />
          <Button title="Envoyer la réservation" onPress={handleReservation} />
        </View>
      )}
      <FlatList
        data={filterHotels()}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  card: {
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  level: {
    fontSize: 14,
    color: '#1e90ff',
    marginLeft: 10,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  priceOriginal: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  priceDiscounted: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6347',
  },
  roomType: {
    fontSize: 14,
    color: '#666',
  },
  bedInfo: {
    fontSize: 14,
    color: '#666',
  },
  dealButton: {
    marginTop: 10,
    color: '#666'
  },
  reservationForm: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 20,
  },
  reservationHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default App;
