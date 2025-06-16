import { Link, Stack, useRouter } from 'expo-router';
import { Input, Button, YStack, Label, H3, Text, Form } from 'tamagui';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import axiosInstance from '~/utils/axiosInstance';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isWeb = Platform.OS === 'web';
  const Wrapper = isWeb ? View : TouchableWithoutFeedback;
  const wrapperProps = isWeb ? {} : { onPress: Keyboard.dismiss };

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Please fill in both email and password.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a valid email address.',
      });
      return;
    }

    try {
      const response = await axiosInstance.post('/users/login', {
        email,
        password,
      });

      const { accessToken, refreshToken, username, email: userEmail } = response.data;

      await AsyncStorage.multiSet([
        ['@accessToken', accessToken],
        ['@refreshToken', refreshToken],
        ['@username', username],
        ['@userEmail', userEmail],
      ]);

      router.replace('/home');
    } catch (error: any) {
      const errMsg = error?.response?.data?.msg || 'Login failed. Please try again.';

      Toast.show({
        type: 'error',
        text1: errMsg,
      });

      console.error('Login error:', error);
    }
  };

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

                <Button
                  onPress={handleLogin}
                  fontWeight="bold"
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    marginTop: 10,
                  }}>
                  Login
                </Button>
                <Link href={'/registration'} style={{ marginTop: 10 }}>
                  <Text
                    style={{ textAlign: 'center' }}
                    fontSize="$3"
                    color="$gray10"
                    fontWeight="400">
                    Don't have an account? Register here.
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
