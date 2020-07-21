import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native'
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';
//import DropDownItem from 'react-native-drop-down-item';


import api from '../../services/api';

import logoImg from '../../assets/logo.png';

import styles from './styles';

export default function OngDetail() {
  const route = useRoute();
  const [incidents, setIncidents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);


  const navigation = useNavigation();
  const incident = route.params.incident;

  function navigateBack() {
    navigation.goBack()
  }

  function navigateToDetail(incident) {
    navigation.navigate('Detail', { incident });
  }

  async function loadOngIncidents() {
    if (loading) {
      return;
    }
    setLoading(true);

    const response = await api.get('profile', {
      headers: {
        Authorization: incident.ong_id,
      },
      params: { page }
    }).then(response => {
      setIncidents(response.data);
    })
    setPage(page + 1);
    setLoading(false);
  }

  useEffect(() => {
    loadOngIncidents();
  }, [incident.ong_id]);

  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />

        <TouchableOpacity onPress={navigateBack}>
          <Feather name="arrow-left" size={28} color="#E82041" />
        </TouchableOpacity>
      </View>

      <Text style={[styles.title,]}>{incident.name}</Text>
      <View style={[styles.incident, { marginTop: 10 }, { marginRight: 80 }]}>
        <Text style={[styles.description]}>{incident.email}</Text>
        <Text style={styles.description}>(
        {incident.whatsapp.slice(0, 2)})
        {incident.whatsapp.slice(2, 7)}-
        {incident.whatsapp.slice(7, 11)}
        </Text>
        <Text style={styles.description}>{incident.city}-{incident.uf}</Text>
      </View>

      <Text style={[styles.descriptionTitle, { marginTop: 10 }]}>Escolha um dos casos da {incident.name} e salve o dia.</Text>
      <FlatList
        data={incidents}
        style={styles.incidentList}
        keyExtractor={incident => String(incident.id)}
        showsVerticalScrollIndicator={false}
        onEndReached={loadOngIncidents}
        onEndReachedThreshold={0.2}
        renderItem={({ item: incident }) => (
          <View style={styles.incident}>

            <Text style={styles.incidentProperty}>CASO:</Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>

            <Text style={styles.incidentProperty}>VALOR:</Text>
            <Text style={styles.incidentValue}>
              {Intl.NumberFormat('pt-Br', {
                style: 'currency',
                currency: 'BRL'
              }).format(incident.value)}
            </Text>

            <TouchableOpacity style={styles.detailsButton}
              onPress={() => navigateToDetail(incident)}>
              <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
              <Feather name="arrow-right" size={16} color="#E02041" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  )
}