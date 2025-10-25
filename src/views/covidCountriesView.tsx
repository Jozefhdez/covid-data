import { SpaceMono_400Regular, SpaceMono_700Bold, useFonts } from '@expo-google-fonts/space-mono';
import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CovidController } from "../controllers/covidController";
import { CovidCountry } from "../models/CovidCountry";

export default function CovidCountriesView() {
  const [fontsLoaded] = useFonts({
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  const [countries, setCountries] = useState<CovidCountry[]>([])
  const [error, setError] = useState<string>("")

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      setError("");
      const data = await CovidController.getAllCountries();
      setCountries(data);
    } catch (error) {
      setError("Error loading countries");
    }
  };

  const handleCountryPress = (country: CovidCountry) => {
    router.push(`/country/${encodeURIComponent(country.country)}`);
  };

  const renderCountry = ({ item }: { item: CovidCountry }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCountryPress(item)}>
      <Image source={{ uri: item.flag }} style={styles.flag} />
      <Text style={styles.countryName}>{item.country}</Text>
      <Text style={styles.cases}>{item.cases.toLocaleString()}</Text>
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Country View</Text>
      </View>
      {error ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadCountries}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : countries.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading countries...</Text>
        </View>
      ) : (
        <FlatList
          data={countries}
          renderItem={renderCountry}
          keyExtractor={(item) => item.country}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  header: {
    backgroundColor: "#000000ff",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    fontFamily: "SpaceMono_700Bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    fontFamily: "SpaceMono_400Regular",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    fontFamily: "SpaceMono_400Regular",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontFamily: "SpaceMono_700Bold",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  flag: {
    width: 80,
    height: 50,
    marginBottom: 8,
  },
  countryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    fontFamily: "SpaceMono_700Bold",
  },
  cases: {
    fontSize: 14,
    color: "#666",
    fontFamily: "SpaceMono_400Regular",
  },
});