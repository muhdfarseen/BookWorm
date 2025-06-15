import { BookOpenCheck, Pencil, Trash2, Star } from '@tamagui/lucide-icons';
import { Button, Card, Input, Text, XStack, YStack } from 'tamagui';
import { Modal, View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type Book = {
  id: number;
  name: string;
  author: string;
  genre: string;
};

export const PendingBooks = () => {
  const [books, setBooks] = useState<Book[]>([
    { id: 1, name: 'Atomic Habits', author: 'James Clear', genre: 'Self-help' },
    { id: 2, name: 'The Subtle Art', author: 'Mark Manson', genre: 'Psychology' },
  ]);

  const [visibleModal, setVisibleModal] = useState<'delete' | 'edit' | 'complete' | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [tempBook, setTempBook] = useState<Book | null>(null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(3);

  const openModal = (type: typeof visibleModal, book: Book) => {
    setSelectedBook(book);
    setTempBook({ ...book });
    setReview('');
    setRating(3);
    setVisibleModal(type);
  };

  const closeModal = () => {
    setVisibleModal(null);
    setSelectedBook(null);
  };

  const handleEdit = () => {
    if (tempBook) {
      setBooks((prev) => prev.map((b) => (b.id === tempBook.id ? { ...tempBook } : b)));
      closeModal();
    }
  };

  const handleDelete = () => {
    if (selectedBook) {
      setBooks((prev) => prev.filter((b) => b.id !== selectedBook.id));
      closeModal();
    }
  };

  return (
    <>
      <YStack gap={10}>
        {books.map((book) => (
          <PendingBookCard
            key={book.id}
            book={book}
            onEdit={() => openModal('edit', book)}
            onDelete={() => openModal('delete', book)}
            onComplete={() => openModal('complete', book)}
          />
        ))}
      </YStack>

      {/* Delete Modal */}
      <Modal visible={visibleModal === 'delete'} transparent animationType="fade">
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          backgroundColor="rgba(0,0,0,0.5)">
          <View
            style={{
              width: '90%',
              backgroundColor: 'white',
              margin: 20,
              padding: 20,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'stretch',
              gap: 12,
            }}>
            <Text fontSize="$6">Delete "{selectedBook?.name}"?</Text>
            <Button theme="red" onPress={handleDelete} mt="$2">
              <Text color="red">Delete</Text>
            </Button>
            <Button onPress={closeModal}>
              <Text>Cancel</Text>
            </Button>
          </View>
        </YStack>
      </Modal>

      {/* Complete Modal */}
      <Modal visible={visibleModal === 'complete'} transparent animationType="fade">
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          backgroundColor="rgba(0,0,0,0.5)">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%', alignItems: 'center' }}>
            <View
              style={{
                width: '90%',
                backgroundColor: 'white',
                margin: 20,
                padding: 20,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'stretch',
                gap: 12,
              }}>
              <Text fontSize="$6">Complete "{selectedBook?.name}"?</Text>

              <Text fontWeight="500" mt="$3">
                Your Review
              </Text>
              <Input
                multiline
                numberOfLines={4}
                value={review}
                onChangeText={setReview}
                style={{ minHeight: 100 }}
              />

              <Text fontWeight="500" mt="$3">
                Rating
              </Text>
              <XStack gap="$2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size="$3"
                    color={i <= rating ? '#facc15' : '#d1d5db'}
                    onPress={() => setRating(i)}
                  />
                ))}
              </XStack>

              <Button
                theme="green"
                mt="$4"
                onPress={() => {
                  alert(`Completed with ${rating} stars: ${review}`);
                  closeModal();
                }}>
                <Text color="green">Submit Review</Text>
              </Button>
              <Button onPress={closeModal}>
                <Text>Cancel</Text>
              </Button>
            </View>
          </KeyboardAvoidingView>
        </YStack>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={visibleModal === 'edit'} transparent animationType="fade">
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          backgroundColor="rgba(0,0,0,0.5)">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: 'white',
                width: '90%',
                margin: 20,
                padding: 20,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'stretch',
                gap: 12,
              }}>
              <Text fontSize="$6">Edit "{tempBook?.name}"</Text>
              <Input
                placeholder="Book Name"
                value={tempBook?.name}
                onChangeText={(text) => setTempBook((prev) => ({ ...prev!, name: text }))}
              />
              <Input
                placeholder="Author"
                value={tempBook?.author}
                onChangeText={(text) => setTempBook((prev) => ({ ...prev!, author: text }))}
              />
              <Input
                placeholder="Genre"
                value={tempBook?.genre}
                onChangeText={(text) => setTempBook((prev) => ({ ...prev!, genre: text }))}
              />
              <Button theme="green" mt="$2" onPress={handleEdit}>
                <Text color="$green10Light">Save</Text>
              </Button>
              <Button onPress={closeModal}>
                <Text>Cancel</Text>
              </Button>
            </View>
          </KeyboardAvoidingView>
        </YStack>
      </Modal>
    </>
  );
};

function PendingBookCard({
  book,
  onEdit,
  onDelete,
  onComplete,
}: {
  book: Book;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
}) {
  return (
    <Card elevate size="$4" borderRadius="$8">
      <Card.Header gap={3}>
        <Text fontSize="$6" fontWeight="700">
          {book.name}
        </Text>
        <Text theme="alt2">By {book.author}</Text>
        <Text theme="alt2">Genre: {book.genre}</Text>
        <XStack marginTop={10} gap="$2">
          <Button
            theme={'green_alt1'}
            color={'$green10Light'}
            flex={1}
            icon={BookOpenCheck}
            onPress={onComplete}>
            <Text color={'$green10Light'}>Mark as Complete</Text>
          </Button>
          <Button icon={Pencil} theme={'blue_alt1'} color={'$blue10Light'} onPress={onEdit} />
          <Button icon={Trash2} theme="red_alt1" color={'red'} onPress={onDelete} />
        </XStack>
      </Card.Header>
    </Card>
  );
}
