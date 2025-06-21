import { View } from 'react-native';
import { ToggleGroup, Text } from 'tamagui';
import { CompletedBooks } from '../../components/CompletedBooks';
import { PendingBooks } from '../../components/PendingBooks';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const Home = () => {
  const [pendingActive, setPenidngActive] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('@username').then((value) => {
      if (value) {
        setUsername(value);
      }
    });
  }, []);

  return (
    <>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24 }}>Welcome</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{username}</Text>
        <Text style={{ fontSize: 16, color: 'gray', marginTop: 5 }}>
          A reader lives a thousand lives before he dies
        </Text>

        <ToggleGroup disableDeactivation={true} marginTop={20} defaultValue="foo" type="single">
          <ToggleGroup.Item onPress={() => setPenidngActive(true)} flex={1} value="foo">
            <Text>Pending</Text>
          </ToggleGroup.Item>
          <ToggleGroup.Item onPress={() => setPenidngActive(false)} flex={1} value="bar">
            <Text>Completed</Text>
          </ToggleGroup.Item>
        </ToggleGroup>
      </View>

      {pendingActive ? <PendingBooks /> : <CompletedBooks />}

      <Toast position="top" />
    </>
  );
};

export default Home;
