import { UndoDot, Pencil, Trash2, Star } from '@tamagui/lucide-icons';
import { useState, useEffect } from 'react';
import { Button, Card, Input, Sheet, Text, XStack, YStack, Separator } from 'tamagui';

import { axiosAuthInstance } from '../utils/axiosAuthinstance';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';

const apiService = {
  getBooks: async () => {
    const response = await axiosAuthInstance.get(`/books`);
    return response.data;
  },

  updateBook: async (id: string, bookData: any) => {
    const response = await axiosAuthInstance.put(`/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id: string) => {
    const response = await axiosAuthInstance.delete(`/books/${id}`);
    return response.data;
  },

  updateBookStatus: async (id: string, currentStatus: boolean) => {
    const response = await axiosAuthInstance.patch(`/books/${id}/status`, {
      currentStatus,
    });
    return response.data;
  },

  setBookRating: async (id: string, rating: number) => {
    const response = await axiosAuthInstance.patch(`/books/${id}/rate`, {
      rating,
    });
    return response.data;
  },

  setBookReview: async (id: string, review: string) => {
    const response = await axiosAuthInstance.patch(`/books/${id}/review`, {
      review,
    });
    return response.data;
  },
};

export default apiService;

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  status?: boolean;
  rating?: number;
  review?: string;
}

export function CompletedBooks() {
  const [openSheet, setOpenSheet] = useState<'delete' | 'complete' | 'edit' | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit form state - now includes rating and review
  const [editForm, setEditForm] = useState({
    title: '',
    author: '',
    genre: '',
    rating: 0,
    review: '',
  });

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBooks();
      // Filter only completed books (status: true)
      const completedBooks = response.data?.filter((book: Book) => book.status === true) || [];
      setBooks(completedBooks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSheet = (type: typeof openSheet, book: Book) => {
    setSelectedBook(book);
    setOpenSheet(type);
    setRating(book.rating || 0);
    setReview(book.review || '');
    setEditForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      rating: book.rating || 0,
      review: book.review || '',
    });
  };

  const handleDeleteBook = async () => {
    if (!selectedBook) return;

    try {
      await apiService.deleteBook(selectedBook._id);
      setBooks(books.filter((book) => book._id !== selectedBook._id));
      setOpenSheet(null);
      setSelectedBook(null);
      Toast.show({
        type: 'success',
        text1: 'Book deleted successfully!',
      });
    } catch (err) {
      console.error('Error deleting book:', err);
      Toast.show({
        type: 'error',
        text1: 'Failed to delete book. Please try again.',
      });
    }
  };

  const handleMarkPending = async () => {
    if (!selectedBook) return;

    try {
      // Update status to pending (false) - only update status
      await apiService.updateBookStatus(selectedBook._id, true);

      fetchBooks();
      setOpenSheet(null);
      setSelectedBook(null);
      Toast.show({
        type: 'success',
        text1: `"${selectedBook.title}" marked as pending!`,
      });
    } catch (err) {
      console.error('Error updating book status:', err);
      Toast.show({
        type: 'error',
        text1: 'Failed to update book status. Please try again.',
      });
    }
  };

  const handleEditBook = async () => {
    if (!selectedBook) return;

    try {
      const updatedData = {
        title: editForm.title,
        author: editForm.author,
        genre: editForm.genre,
      };

      // Update basic book info
      await apiService.updateBook(selectedBook._id, updatedData);

      // Update rating if changed
      if (editForm.rating !== selectedBook.rating) {
        await apiService.setBookRating(selectedBook._id, editForm.rating);
      }

      // Update review if changed
      if (editForm.review !== selectedBook.review) {
        await apiService.setBookReview(selectedBook._id, editForm.review);
      }

      // Update local state with all changes
      setBooks(
        books.map((book) =>
          book._id === selectedBook._id
            ? {
                ...book,
                ...updatedData,
                rating: editForm.rating,
                review: editForm.review,
              }
            : book
        )
      );

      setOpenSheet(null);
      setSelectedBook(null);
      Toast.show({
        type: 'success',
        text1: `Book updated successfully!`,
      });
      // alert('Book updated successfully!');
    } catch (err) {
      console.error('Error updating book:', err);
      Toast.show({
        type: 'error',
        text1: 'Failed to update book. Please try again.',
      });
      // alert('Failed to update book. Please try again.');
    }
  };

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Loading books...</Text>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" gap="$3">
        <Text color="$red10">Error: {error}</Text>
        <Button onPress={fetchBooks}>
          <Text>Retry</Text>
        </Button>
      </YStack>
    );
  }

  if (books.length === 0) {
    return (
      <YStack alignItems="center" gap="$2" marginTop="$8">
        <Text fontSize="$5" color="$color11">
          You haven't completed any books yet.
        </Text>
        <Text fontSize="$3" color="$color10">
          Start reading and track your progress!
        </Text>
      </YStack>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}>
        <YStack gap={10} marginBottom={20}>
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onDeletePress={() => handleOpenSheet('delete', book)}
              onEditPress={() => handleOpenSheet('edit', book)}
              onCompletePress={() => handleOpenSheet('complete', book)}
            />
          ))}
        </YStack>
      </ScrollView>

      <Sheet
        native={true}
        open={!!openSheet}
        onOpenChange={(val: boolean) => {
          if (!val) {
            setOpenSheet(null);
            setSelectedBook(null);
          }
        }}
        modal
        snapPointsMode="fit"
        animation="quick">
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame padding="$4" paddingBottom={50}>
          {selectedBook && (
            <>
              {openSheet === 'delete' && (
                <>
                  <Text fontSize="$5">Are you sure you want to delete "{selectedBook.title}"?</Text>
                  <YStack gap="$3" mt="$4">
                    <Button theme="red" color={'$red'} onPress={handleDeleteBook}>
                      <Text color="red">Delete</Text>
                    </Button>
                    <Button onPress={() => setOpenSheet(null)}>
                      <Text>Cancel</Text>
                    </Button>
                  </YStack>
                </>
              )}

              {openSheet === 'complete' && (
                <>
                  <Text fontSize="$5">Mark "{selectedBook.title}" as pending completion?</Text>
                  <YStack gap="$3" mt="$4">
                    <Button theme="red" onPress={handleMarkPending}>
                      <Text color="red">Mark as Pending</Text>
                    </Button>
                    <Button onPress={() => setOpenSheet(null)}>
                      <Text>Cancel</Text>
                    </Button>
                  </YStack>
                </>
              )}

              {openSheet === 'edit' && (
                <>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={60}
                    style={{ flex: 1 }}>
                    <ScrollView>
                      <Text fontSize="$5">Edit "{selectedBook.title}"</Text>
                      <YStack gap="$3" mt="$4">
                        <Input
                          placeholder="Book Title"
                          value={editForm.title}
                          onChangeText={(text) => setEditForm((prev) => ({ ...prev, title: text }))}
                        />
                        <Input
                          placeholder="Author"
                          value={editForm.author}
                          onChangeText={(text) =>
                            setEditForm((prev) => ({ ...prev, author: text }))
                          }
                        />
                        <Input
                          placeholder="Genre"
                          value={editForm.genre}
                          onChangeText={(text) => setEditForm((prev) => ({ ...prev, genre: text }))}
                        />

                        <Text fontWeight="500">Rating</Text>
                        <XStack gap="$2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              size="$3"
                              color={i <= editForm.rating ? '#facc15' : '#d1d5db'}
                              onPress={() => setEditForm((prev) => ({ ...prev, rating: i }))}
                              style={{ cursor: 'pointer' }}
                            />
                          ))}
                        </XStack>

                        <Input
                          multiline
                          numberOfLines={4}
                          placeholder="Write a review"
                          value={editForm.review}
                          onChangeText={(text) =>
                            setEditForm((prev) => ({ ...prev, review: text }))
                          }
                          style={{ minHeight: 100 }}
                        />

                        <Button theme="green" onPress={handleEditBook}>
                          <Text color="green">Save Changes</Text>
                        </Button>
                        <Button onPress={() => setOpenSheet(null)}>
                          <Text>Cancel</Text>
                        </Button>
                      </YStack>
                    </ScrollView>
                  </KeyboardAvoidingView>
                </>
              )}
            </>
          )}
        </Sheet.Frame>
      </Sheet>
    </>
  );
}

function BookCard({
  book,
  onDeletePress,
  onCompletePress,
  onEditPress,
}: {
  book: Book;
  onDeletePress: () => void;
  onCompletePress: () => void;
  onEditPress: () => void;
}) {
  const renderStars = (rating: number = 0) => {
    return [1, 2, 3, 4, 5].map((i) => (
      <Star key={i} size="$1" color={i <= rating ? '#facc15' : '#d1d5db'} />
    ));
  };

  return (
    <Card elevate size="$4" borderRadius="$8">
      <Card.Header gap={3} paddingBottom={10}>
        <Text fontWeight={600} fontSize="$6">
          {book.title}
        </Text>
        <Text theme="alt2">By {book.author}</Text>
        <Text theme="alt2">Genre: {book.genre}</Text>
        <Separator marginVertical={10} />
        <Text theme="alt2" numberOfLines={2}>
          {book.review || 'No review available'}
        </Text>
        <XStack mt={'$2'} gap="$1">
          {renderStars(book.rating)}
        </XStack>
      </Card.Header>
      <Card.Footer paddingHorizontal={10} paddingBottom={10}>
        <XStack width="100%" gap={5}>
          <Button flex={1} borderRadius="$5" icon={UndoDot} onPress={onCompletePress}>
            <Text>Mark Pending</Text>
          </Button>
          <Button
            icon={Pencil}
            theme="blue"
            color={'$blue10Light'}
            borderRadius="$5"
            onPress={onEditPress}
          />
          <Button
            icon={Trash2}
            theme="red"
            color={'$red10Light'}
            borderRadius="$5"
            onPress={onDeletePress}
          />
        </XStack>
      </Card.Footer>
    </Card>
  );
}
