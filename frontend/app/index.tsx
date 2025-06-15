import { Link, Stack, useRouter } from 'expo-router';
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

export default function Login() {
  const isWeb = Platform.OS === 'web';

  const Wrapper = isWeb ? View : TouchableWithoutFeedback;
  const wrapperProps = isWeb ? {} : { onPress: Keyboard.dismiss };

  const router = useRouter();

  const handleLogin = async () => {
    router.replace('/home'); 
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
                <Text style={{marginBottom:'20'}} fontSize="$5" color="$gray10" fontWeight="400">
                  and every book is a new adventure.
                </Text>

                <YStack>
                  <Label htmlFor="email" fontWeight="normal">
                    Email
                  </Label>
                  <Input keyboardType="email-address" aria-label="email" placeholder="Email" />
                </YStack>

                <YStack>
                  <Label htmlFor="password" fontWeight="normal">
                    Password
                  </Label>
                  <Input secureTextEntry aria-label="password" placeholder="Password" />
                </YStack>

                <Button
                  onPress={handleLogin                  }
                  fontWeight="bold"
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    marginTop: 10,
                  }}>
                  Login
                </Button>
                <Link href={'/registration'} style={{ marginTop: 10 }}>
                  <Text style={{textAlign:"center"}} fontSize="$3" color="$gray10" fontWeight="400">
                    Don't have an account? Register here.
                  </Text>
                </Link>
              </YStack>
            </Form>
          </ScrollView>
        </Wrapper>
      </KeyboardAvoidingView>
    </>
  );
}


