import { UndoDot, Pencil, Trash2, Star } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { Button, Card, Input, Sheet, Text, XStack, YStack, Separator } from 'tamagui';

export function CompletedBooks() {
  const [openSheet, setOpenSheet] = useState<'delete' | 'complete' | 'edit' | null>(null);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const bookList = [
    {
      id: 1,
      name: 'Atomic Habits',
      author: 'James Clear',
      genre: 'Self-help',
    },
    {
      id: 2,
      name: 'Harry Potter',
      author: 'J.K. Rowling',
      genre: 'Fantasy',
    },
    {
      id: 3,
      name: 'Sapiens',
      author: 'Yuval Noah Harari',
      genre: 'History',
    },
  ];

  const handleOpenSheet = (type: typeof openSheet, book: any) => {
    setSelectedBook(book);
    setOpenSheet(type);
    setRating(3);
    setReview('This book is awesome!');
  };

  return (
    <>
      <YStack gap={10} marginBottom={20}>
        {bookList.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onDeletePress={() => handleOpenSheet('delete', book)}
            onEditPress={() => handleOpenSheet('edit', book)}
            onCompletePress={() => handleOpenSheet('complete', book)}
          />
        ))}
      </YStack>

      <Sheet
        native={true}
        open={!!openSheet}
        onOpenChange={(val: any) => {
          if (!val) {
            setOpenSheet(null);
            setSelectedBook(null);
          }
        }}
        modal
        snapPointsMode="fit"
        animation="quick"
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame padding="$4">
          {selectedBook && (
            <>
              {openSheet === 'delete' && (
                <>
                  <Text fontSize="$5">
                    Are you sure you want to delete "{selectedBook.name}"?
                  </Text>
                  <YStack gap="$3" mt="$4">
                    <Button theme="red" onPress={() => setOpenSheet(null)}>
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
                  <Text fontSize="$5">
                    Mark "{selectedBook.name}" as pending completion?
                  </Text>
                  <YStack gap="$3" mt="$4">
                    <Text fontWeight="500">Rating</Text>
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

                    <Input
                      multiline
                      numberOfLines={4}
                      placeholder="Write a review"
                      value={review}
                      onChangeText={setReview}
                      style={{ minHeight: 100 }}
                    />

                    <Button
                      theme="green"
                      onPress={() => {
                        alert(`Marked "${selectedBook.name}" with ${rating} stars and review: ${review}`);
                        setOpenSheet(null);
                      }}
                    >
                      <Text>Mark as Pending</Text>
                    </Button>
                    <Button onPress={() => setOpenSheet(null)}>
                      <Text>Cancel</Text>
                    </Button>
                  </YStack>
                </>
              )}

              {openSheet === 'edit' && (
                <>
                  <Text fontSize="$5">Edit "{selectedBook.name}"</Text>
                  <YStack gap="$3" mt="$4">
                    <Input
                      placeholder="Book Name"
                      value={selectedBook.name}
                      onChangeText={(text) =>
                        setSelectedBook((prev: any) => ({ ...prev, name: text }))
                      }
                    />
                    <Input
                      placeholder="Author"
                      value={selectedBook.author}
                      onChangeText={(text) =>
                        setSelectedBook((prev: any) => ({ ...prev, author: text }))
                      }
                    />
                    <Input
                      placeholder="Genre"
                      value={selectedBook.genre}
                      onChangeText={(text) =>
                        setSelectedBook((prev: any) => ({ ...prev, genre: text }))
                      }
                    />
                    <Button theme="green" onPress={() => setOpenSheet(null)}>
                      <Text>Save Changes</Text>
                    </Button>
                    <Button onPress={() => setOpenSheet(null)}>
                      <Text>Cancel</Text>
                    </Button>
                  </YStack>
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
  book: any;
  onDeletePress: () => void;
  onCompletePress: () => void;
  onEditPress: () => void;
}) {
  return (
    <Card style={{ borderRadius: 20 }} elevate size="$4">
      <Card.Header gap={3} paddingBottom={10}>
        <Text fontWeight={600} fontSize="$6">
          {book.name}
        </Text>
        <Text theme="alt2">By {book.author}</Text>
        <Text theme="alt2">Genre: {book.genre}</Text>
        <Separator marginVertical={10} />
        <XStack gap="$1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size="$1" color="#facc15" />
          ))}
        </XStack>
        <Text theme="alt2">Review here a long text</Text>
      </Card.Header>
      <Card.Footer paddingHorizontal={10} paddingBottom={10}>
        <XStack width="100%" gap={5}>
          <Button flex={1} borderRadius="$5" icon={UndoDot} onPress={onCompletePress}>
            <Text>Mark Pending</Text>
          </Button>
          <Button icon={Pencil} theme="blue" color={"$blue10Light"} borderRadius="$5" onPress={onEditPress} />
          <Button icon={Trash2} theme="red" color={"$red10Light"} borderRadius="$5" onPress={onDeletePress} />
        </XStack>
      </Card.Footer>
      <Card.Background borderRadius={10} backgroundColor="white" />
    </Card>
  );
}
