import { View, Text } from 'react-native';
import { ToggleGroup, ScrollView } from 'tamagui';
import { CompletedBooks } from '../../components/CompletedBooks';
import { PendingBooks } from '../../components/PendingBooks';
import { useState } from 'react';

const home = () => {
  const [pendingActive, setPenidngActive] = useState(true);

  return (
    <>
      <View style={{padding: 20}}>
        <Text style={{ fontSize: 24 }}>Welcome</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Muhammed Farseen</Text>
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

      <ScrollView paddingHorizontal={20} style={{ flex: 1 }}>
        {pendingActive ? <PendingBooks /> : <CompletedBooks />}
      </ScrollView>
    </>
  );
};

export default home;
