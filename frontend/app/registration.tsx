import { Link, router, Stack } from 'expo-router';
import { Input, Button, YStack, Label, H3, Text, Form } from 'tamagui';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import { Book } from '@tamagui/lucide-icons';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import axiosInstance from '../utils/axiosInstance';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    console.log(name, email, password, confirmPassword);
    if (!name || !email || !password || !confirmPassword) {
      Toast.show({
        type: 'info',
        text1: 'Please fill in all fields',
      });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match',
      });
      return;
    }
    try {
      const response = await axiosInstance.post('/users/register', {
        username: name,
        email: email,
        password: password,
      });

      if (response.data) {
        Toast.show({
          type: 'success',
          text1: 'You have successfully registered!',
        });
        router.replace('/');
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.response?.data?.msg || 'Something went wrong. Please try again.',
      });
    }
  };

  const isWeb = Platform.OS === 'web';

  const Wrapper = isWeb ? View : TouchableWithoutFeedback;
  const wrapperProps = isWeb ? {} : { onPress: Keyboard.dismiss };

  return (
    <>
      <Stack.Screen options={{ title: 'Book Worm' }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={64}>
        <Wrapper {...wrapperProps}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <Form flex={1}>
              <YStack
                flex={1}
                gap="$2"
                justifyContent="center"
                padding="$6"
                minHeight={isWeb ? '100vh' : undefined}>
                <Book size="$4" />

                <H3 fontWeight="bold">Book Worm</H3>
                <Text fontSize="$5" color="$gray10" fontWeight="400">
                  Reading is a journey,
                </Text>
                <Text style={{ marginBottom: '20' }} fontSize="$5" color="$gray10" fontWeight="400">
                  and every book is a new adventure.
                </Text>

                <YStack>
                  <Label htmlFor="name" fontWeight="normal">
                    Name
                  </Label>
                  <Input
                    onChange={(e) => setName(e.nativeEvent.text)}
                    aria-label="email"
                    placeholder="Name"
                  />
                </YStack>

                <YStack>
                  <Label htmlFor="email" fontWeight="normal">
                    Email
                  </Label>
                  <Input
                    onChange={(e) => setEmail(e.nativeEvent.text)}
                    keyboardType="email-address"
                    aria-label="email"
                    placeholder="Email"
                  />
                </YStack>

                <YStack>
                  <Label htmlFor="password" fontWeight="normal">
                    Password
                  </Label>
                  <Input
                    onChange={(e) => setPassword(e.nativeEvent.text)}
                    secureTextEntry
                    aria-label="password"
                    placeholder="Password"
                  />
                </YStack>

                <YStack>
                  <Label htmlFor="confirmpassword" fontWeight="normal">
                    Confirm Password
                  </Label>
                  <Input
                    onChange={(e) => setConfirmPassword(e.nativeEvent.text)}
                    secureTextEntry
                    aria-label="confirmpassword"
                    placeholder="Password"
                  />
                </YStack>

                <Button
                  fontWeight="bold"
                  onPress={handleRegister}
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    marginTop: 10,
                  }}>
                  Register
                </Button>
                <Link href={'/'} style={{ marginTop: 10 }}>
                  <Text
                    style={{ textAlign: 'center' }}
                    fontSize="$3"
                    color="$gray10"
                    fontWeight="400">
                    Already have an account? Login here.
                  </Text>
                </Link>
              </YStack>
            </Form>
          </ScrollView>
        </Wrapper>
        <Toast position="top" bottomOffset={20} />
      </KeyboardAvoidingView>
    </>
  );
}
