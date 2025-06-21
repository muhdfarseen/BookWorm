import { BookOpenCheck, Pencil, Trash2, Star } from '@tamagui/lucide-icons';
import { Button, Card, Input, Text, XStack, YStack } from 'tamagui';
import {
  Modal,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useEffect, useState } from 'react';
import { axiosAuthInstance } from '../utils/axiosAuthinstance';
import Toast from 'react-native-toast-message';

type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  status?: boolean;
  rating?: number;
  review?: string;
};

export const PendingBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [visibleModal, setVisibleModal] = useState<'delete' | 'edit' | 'complete' | 'add' | null>(
    null
  );
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [tempBook, setTempBook] = useState<Book | null>(null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(3);
  const [loading, setLoading] = useState(false);

  // Add book form state
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axiosAuthInstance.get('/books');
      console.log('Fetch response:', res.data); // Debug log

      // Handle case where no books are found (404) vs actual data
      if (res.status === 200 && res.data.data) {
        const filtered = res.data.data
          .map((book: any) => ({
            ...book,
            id: book._id || book.id, // Map _id to id
          }))
          .filter((book: Book) => !book.status);
        setBooks(filtered);
        console.log('Mapped books:', filtered);
      } else {
        setBooks([]);
      }
    } catch (error: any) {
      console.error('Fetch failed', error.response?.data || error.message);
      // If 404, it means no books found, which is okay
      if (error.response?.status === 404) {
        setBooks([]);
      } else {
        Alert.alert('Error', 'Failed to fetch books');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const openModal = (type: typeof visibleModal, book?: Book) => {
    console.log('Opening modal:', type, 'for book:', book?.title);
    if (book) {
      setSelectedBook(book);
      if (type === 'edit') setTempBook({ ...book });
      if (type === 'complete') {
        setReview(book.review || '');
        setRating(book.rating ?? 3);
      }
    }
    setVisibleModal(type);
  };

  const closeModal = () => {
    setVisibleModal(null);
    setSelectedBook(null);
    setTempBook(null);
    setReview('');
    setRating(3);
    // Reset add book form
    setBookName('');
    setAuthor('');
    setGenre('');
  };

  const handleAddBook = async () => {
    if (!bookName || !author || !genre) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosAuthInstance.post('/books/', {
        title: bookName,
        author: author,
        genre: genre,
      });

      if (response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Book added successfully',
        });
        closeModal();
        fetchBooks();
      }
    } catch (error: any) {
      console.error('Add book failed', error.response?.data || error.message);
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.msg || 'Failed to add book',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    console.log('handleDelete called for book:', selectedBook?.id);
    if (!selectedBook?.id) {
      console.log('No selected book ID');
      return;
    }

    try {
      setLoading(true);
      console.log('Making delete request to:', `/books/${selectedBook.id}`);

      // Fixed: Use path parameter instead of query parameter
      const response = await axiosAuthInstance.delete(`/books/${selectedBook.id}`);
      console.log('Delete response:', response.data); // Debug log

      setBooks((prev) => prev.filter((b) => b.id !== selectedBook.id));
      closeModal();
      Toast.show({
        type: 'success',
        text1: 'Book deleted successfully',
      });
    } catch (error: any) {
      console.error('Delete failed', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.msg || 'Failed to delete book');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!tempBook?.id) return;

    try {
      setLoading(true);
      // Fixed: Send only the fields that can be updated
      const updateData = {
        title: tempBook.title,
        author: tempBook.author,
        genre: tempBook.genre,
      };

      const response = await axiosAuthInstance.put(`/books/${tempBook.id}`, updateData);
      console.log('Edit response:', response.data); // Debug log

      setBooks((prev) => prev.map((b) => (b.id === tempBook.id ? { ...b, ...tempBook } : b)));
      closeModal();
      Toast.show({
        type: 'success',
        text1: 'Book updated successfully',
      });
    } catch (error: any) {
      console.error('Edit failed', error.response?.data || error.message);
      Toast.show({
        type: 'success',
        text1: 'Failed to update book',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!selectedBook?.id) return;

    try {
      setLoading(true);

      // Fixed: Make all updates in sequence with proper error handling
      console.log('Updating book status for ID:', selectedBook.id);

      // Update status
      await axiosAuthInstance.patch(`/books/${selectedBook.id}/status`, {
        currentStatus: selectedBook.status ?? false,
      });

      // Update rating if provided
      if (rating) {
        await axiosAuthInstance.patch(`/books/${selectedBook.id}/rate`, {
          rating,
        });
      }

      // Update review if provided
      if (review.trim()) {
        await axiosAuthInstance.patch(`/books/${selectedBook.id}/review`, {
          review: review.trim(),
        });
      }

      // Remove from pending books list
      setBooks((prev) => prev.filter((b) => b.id !== selectedBook.id));
      closeModal();
      Toast.show({
        type: 'success',
        text1: 'Book marked as complete!',
      });
    } catch (error: any) {
      console.error('Complete failed', error.response?.data || error.message);
      Toast.show({
        type: 'success',
        text1: 'Failed to complete book',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && books.length === 0) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Loading books...</Text>
      </YStack>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}>
        <YStack gap="$3">
          {books.length === 0 ? (
            <YStack alignItems="center" gap="$2" marginTop="$8">
              <Text fontSize="$5" color="$color11">
                No pending books
              </Text>
              <Text fontSize="$3" color="$color10">
                Add some books to get started!
              </Text>
            </YStack>
          ) : (
            books.map((book) => (
              <PendingBookCard
                key={book.id}
                book={book}
                onEdit={() => openModal('edit', book)}
                onDelete={() => openModal('delete', book)}
                onComplete={() => openModal('complete', book)}
                disabled={loading}
              />
            ))
          )}
        </YStack>
      </ScrollView>

      {/* Add Book Button */}
      <TouchableOpacity onPress={() => openModal('add')} style={styles.addBtn}>
        <Text style={{ color: 'white', fontSize: 28 }}>+</Text>
      </TouchableOpacity>

      {/* Add Book Modal */}
      <Modal visible={visibleModal === 'add'} transparent animationType="fade">
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
              <Text fontSize="$6">Add Book</Text>
              <Input
                onChange={(e) => setBookName(e.nativeEvent.text)}
                placeholder="Book Name"
                value={bookName}
              />
              <Input
                onChange={(e) => setAuthor(e.nativeEvent.text)}
                placeholder="Author"
                value={author}
              />
              <Input
                onChange={(e) => setGenre(e.nativeEvent.text)}
                placeholder="Genre"
                value={genre}
              />
              <Button
                onPress={handleAddBook}
                theme="green"
                mt="$2"
                disabled={loading}
                opacity={loading ? 0.6 : 1}>
                <Text color="$green10Light">{loading ? 'Adding...' : 'Save'}</Text>
              </Button>
              <Button onPress={closeModal} disabled={loading}>
                <Text>Cancel</Text>
              </Button>
            </View>
          </KeyboardAvoidingView>
        </YStack>
      </Modal>

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
              padding: 20,
              borderRadius: 20,
              gap: 12,
            }}>
            <Text fontSize="$6">Delete "{selectedBook?.title}"?</Text>
            <Text fontSize="$4" color="$color11">
              This action cannot be undone.
            </Text>
            <Button
              theme="red"
              onPress={handleDelete}
              disabled={loading}
              opacity={loading ? 0.6 : 1}>
              <Text color="red">{loading ? 'Deleting...' : 'Delete'}</Text>
            </Button>
            <Button
              onPress={() => {
                console.log('Cancel button pressed');
                closeModal();
              }}
              disabled={loading}>
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
                padding: 20,
                borderRadius: 10,
                gap: 12,
              }}>
              <Text fontSize="$6">Complete "{selectedBook?.title}"?</Text>

              <Text fontWeight="500">Your Review (Optional)</Text>
              <Input
                multiline
                numberOfLines={4}
                value={review}
                onChangeText={setReview}
                placeholder="What did you think about this book?"
                style={{ minHeight: 100 }}
              />

              <Text fontWeight="500">Rating</Text>
              <XStack gap="$2" alignItems="center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    onPress={() => setRating(i)}
                    size="$3"
                    color={i <= rating ? '#facc15' : '#d1d5db'}
                    fill={i <= rating ? '#facc15' : 'transparent'}
                  />
                ))}
                <Text marginLeft="$2" color="$color11">
                  ({rating}/5)
                </Text>
              </XStack>

              <Button
                theme="green"
                onPress={() => {
                  console.log('Complete button pressed');
                  handleComplete();
                }}
                disabled={loading}
                opacity={loading ? 0.6 : 1}>
                <Text color="green">{loading ? 'Submitting...' : 'Mark Complete'}</Text>
              </Button>
              <Button
                onPress={() => {
                  console.log('Cancel button pressed');
                  closeModal();
                }}
                disabled={loading}>
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
                padding: 20,
                borderRadius: 20,
                gap: 12,
              }}>
              <Text fontSize="$6">Edit "{tempBook?.title}"</Text>
              <Input
                placeholder="Title"
                value={tempBook?.title || ''}
                onChangeText={(text) =>
                  setTempBook((prev) => (prev ? { ...prev, title: text } : prev))
                }
              />
              <Input
                placeholder="Author"
                value={tempBook?.author || ''}
                onChangeText={(text) =>
                  setTempBook((prev) => (prev ? { ...prev, author: text } : prev))
                }
              />
              <Input
                placeholder="Genre"
                value={tempBook?.genre || ''}
                onChangeText={(text) =>
                  setTempBook((prev) => (prev ? { ...prev, genre: text } : prev))
                }
              />
              <Button
                theme="green"
                onPress={() => {
                  console.log('Save button pressed');
                  handleEdit();
                }}
                disabled={loading || !tempBook?.title?.trim() || !tempBook?.author?.trim()}
                opacity={
                  loading || !tempBook?.title?.trim() || !tempBook?.author?.trim() ? 0.6 : 1
                }>
                <Text color="$green10Light">{loading ? 'Saving...' : 'Save'}</Text>
              </Button>
              <Button
                onPress={() => {
                  console.log('Cancel button pressed');
                  closeModal();
                }}
                disabled={loading}>
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
  disabled = false,
}: {
  book: Book;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  disabled?: boolean;
}) {
  return (
    <Card elevate size="$4" borderRadius="$8" opacity={disabled ? 0.6 : 1}>
      <Card.Header gap={3}>
        <Text fontSize="$6" fontWeight="700">
          {book.title}
        </Text>
        <Text theme="alt2">By {book.author}</Text>
        <Text theme="alt2">Genre: {book.genre}</Text>
        <XStack marginTop={10} gap="$2">
          <Button
            theme="green_alt1"
            color="$green10Light"
            flex={1}
            icon={BookOpenCheck}
            onPress={onComplete}
            disabled={disabled}>
            <Text color="$green10Light">Mark as Complete</Text>
          </Button>
          <Button
            icon={Pencil}
            theme="blue_alt1"
            color="$blue10Light"
            onPress={onEdit}
            disabled={disabled}
          />
          <Button
            icon={Trash2}
            theme="red_alt1"
            color="red"
            onPress={onDelete}
            disabled={disabled}
          />
        </XStack>
      </Card.Header>
    </Card>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    cursor: 'pointer',
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
