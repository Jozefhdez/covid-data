import { SpaceMono_400Regular, SpaceMono_700Bold, useFonts } from '@expo-google-fonts/space-mono';
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Svg, { Path } from "react-native-svg";
import { CovidController } from "../controllers/covidController";

type Props = {
  countryName?: string;
};

export default function CountryDetailView({ countryName }: Props) {
  const [fontsLoaded] = useFonts({
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  const [countryData, setCountryData] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (countryName) {
      loadData();
    }
  }, [countryName]);

  const loadData = async () => {
    try {
      setLoading(true);
      const countries = await CovidController.getAllCountries();
      const country = countries.find((c) => c.country === countryName);
      setCountryData(country);

      const historical = await CovidController.getHistoricalData(countryName || "");
      setHistoricalData(historical);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!historicalData?.timeline?.cases) {
      return { labels: [], datasets: [{ data: [0] }] } as { labels: string[]; datasets: { data: number[] }[] };
    }
    const cases = historicalData.timeline.cases;
    const allDates = Object.keys(cases) as string[];
    const allValues = Object.values(cases).map((v) => Number(v)) as number[];

    const yearMap = new Map<string, { value: number; index: number }>();
    
    allDates.forEach((dateStr, index) => {
      const [month, day, year] = dateStr.split('/');
      const fullYear = parseInt(year) < 50 ? `20${year}` : `19${year}`;
      
      if (!yearMap.has(fullYear)) {
        yearMap.set(fullYear, { value: allValues[index], index });
      }
    });

    const sortedYears = Array.from(yearMap.entries())
      .sort(([yearA], [yearB]) => parseInt(yearA) - parseInt(yearB));
    
    const labels = sortedYears.map(([year]) => year);
    const values = sortedYears.map(([, data]) => data.value);

    return {
      labels,
      datasets: [{ data: values }],
    };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <View style={styles.svgContainer}>
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <Path 
              d="M15 7L10 12L15 17" 
              stroke="#ffffff" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </TouchableOpacity>

      {!fontsLoaded || loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : countryData ? (
        <>
          <Text style={styles.title}>{countryData.country}</Text>
          <Image source={{ uri: countryData.flag }} style={styles.flag} />
          <Text style={styles.stat}>Cases: {countryData.cases.toLocaleString()}</Text>
          <Text style={styles.stat}>Recovered: {countryData.recovered.toLocaleString()}</Text>
          <Text style={styles.stat}>Deaths: {countryData.deaths.toLocaleString()}</Text>

          {historicalData && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Cases Chart</Text>
              <LineChart
                data={getChartData()}
                width={Dimensions.get("window").width + 50}
                height={200}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: () => "#000",
                  labelColor: () => "#666",
                  propsForLabels: {
                    fontSize: 12,
                  },
                  paddingRight: 64,
                }}
                withDots={false}
                withInnerLines={false}
                withVerticalLines={false}
                withHorizontalLines={false}
                style={styles.chart}
                bezier
              />
            </View>
          )}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 7,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  svgContainer: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    fontSize: 20,
    color: "white",
    fontFamily: "SpaceMono_700Bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: "SpaceMono_700Bold",
  },
  flag: {
    width: 100,
    height: 60,
    marginBottom: 16,
  },
  stat: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontFamily: "SpaceMono_400Regular",
  },
  chartContainer: {
    marginTop: 20,
    width: "100%",
    overflow: "hidden",
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: "SpaceMono_700Bold",
    paddingHorizontal: 16,
  },
  chart: {
    marginVertical: 8,
  },
  cases: {
    fontSize: 16,
    color: "#333",
  },
  subtitle: {
    color: "#666",
  },
});