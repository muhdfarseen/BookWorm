import { LogOut } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { Avatar, Button, Text, YStack } from 'tamagui';

const user = {
  name: 'Muhammed Farseen TP',
  email: 'farseen@example.com',
};

export default function Profile() {
  const handleLogOut = async () => {
    router.replace('/');
  };

  return (
    <YStack f={1} p="$4" gap="$4" bg="$background">
      <YStack alignItems="center" flex={1} paddingVertical={'$6'} gap="$2">
        <Avatar circular size="$9">
          <Avatar.Image src="https://media.istockphoto.com/id/1384207765/vector/open-book-diary-with-white-paper-blank-pages-and-bookmark-3d-vector-icon-cartoon-minimal.jpg?s=612x612&w=0&k=20&c=-aryLPrZgniAbbPzbyrvigtuWva_FsKSuORMdwov8Go=" />
          <Avatar.Fallback />
        </Avatar>

        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 15 }}>{user.name}</Text>
        <Text color="$gray10">{user.email}</Text>
      </YStack>

      <YStack gap={'$3'} mt="$2">
        <Button>
          <Text>Change Email</Text>
        </Button>

        <Button>
          <Text>Change Password</Text>
        </Button>

        <Button
          onPress={handleLogOut}
          color={'$red10Light'}
          theme={'red'}
          icon={LogOut}>
          <Text color={'$red10Light'}>Logout</Text>
        </Button>
      </YStack>
    </YStack>
  );
}
