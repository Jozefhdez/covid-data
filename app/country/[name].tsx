import CountryDetailView from '@/src/views/countryDetailView';
import { useLocalSearchParams } from 'expo-router';

export default function CountryDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  
  return <CountryDetailView countryName={name} />;
}
