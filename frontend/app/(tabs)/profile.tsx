import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogOut, Star } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Avatar, Button, Text, XStack, YStack } from 'tamagui';
import { axiosAuthInstance } from '~/utils/axiosAuthinstance';

export default function Profile() {
  const [avgRating, setAvgRating] = useState(0);
  const [userName, setUserName] = useState('Guest User');
  const [userEmail, setUserEmail] = useState('Guest User');

  const handleLogOut = async () => {
    await AsyncStorage.clear();
    router.replace('/');
  };

  const getAvgRating = async () => {
    const response = await axiosAuthInstance.get(`/books/average-rating`);
    setAvgRating(response.data.avgRating);
  };

  const fetchUserData = async () => {
    const username = await AsyncStorage.getItem('@username');
    const userEmail = await AsyncStorage.getItem('@userEmail');
    setUserName(username || 'Guest User');
    setUserEmail(userEmail || 'Guest User');
  };

  useEffect(() => {
    fetchUserData();
    getAvgRating();
  }, []);

  return (
    <YStack f={1} p="$4" gap="$4" bg="$background">
      <YStack alignItems="center" flex={1} paddingVertical={'$6'} gap="$2">
        <Avatar circular size="$9">
          <Avatar.Image src="https://media.istockphoto.com/id/1384207765/vector/open-book-diary-with-white-paper-blank-pages-and-bookmark-3d-vector-icon-cartoon-minimal.jpg?s=612x612&w=0&k=20&c=-aryLPrZgniAbbPzbyrvigtuWva_FsKSuORMdwov8Go=" />
          <Avatar.Fallback />
        </Avatar>

        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 15 }}>{userName}</Text>

        <Text color="$gray10">{userEmail}</Text>
        <XStack mt="$5" gap="$1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size="$" color={i <= avgRating  ? '#facc15' : '#d1d5db'} />
          ))}
        </XStack>
        <Text fontSize={'$2'} color="$gray10" mt="$2">
          Your Average Book Rating
        </Text>

        
      </YStack>

      <YStack gap={'$3'} mt="$2">
        <Button>
          <Text>Change Email</Text>
        </Button>

        <Button>
          <Text>Change Password</Text>
        </Button>

        <Button onPress={handleLogOut} color={'$red10Light'} theme={'red'} icon={LogOut}>
          <Text color={'$red10Light'}>Logout</Text>
        </Button>
      </YStack>
    </YStack>
  );
}
