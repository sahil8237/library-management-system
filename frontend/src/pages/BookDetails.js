import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import axios from 'axios';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/books/${id}`);
        setBook(response.data.data);
        setError(null);

        // Fetch similar books
        fetchSimilarBooks();
      } catch (err) {
        setError('Failed to fetch book details');
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchSimilarBooks = async () => {
    try {
      setSimilarLoading(true);
      const response = await axios.get(`http://localhost:5000/api/books/${id}/similar`);
      setSimilarBooks(response.data.data);
    } catch (err) {
      console.error('Error fetching similar books:', err);
    } finally {
      setSimilarLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Book not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button component={Link} to="/books" variant="outlined" sx={{ mb: 3 }}>
        ← Back to Catalog
      </Button>

      <Grid container spacing={4}>
        {/* Main Book Details */}
        <Grid item xs={12} lg={8}>
          <Card>
            <Grid container>
              <Grid item xs={12} md={4}>
                <CardMedia
                  component="img"
                  height="400"
                  image={book.coverImage || '/placeholder-book.jpg'}
                  alt={book.title}
                  sx={{ objectFit: 'contain', objectPosition: 'center' }}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {book.title}
                  </Typography>

                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    by {book.author}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={book.status}
                      color={book.status === 'available' ? 'success' : 'warning'}
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`${book.availableCopies} of ${book.totalCopies} available`}
                      color={book.availableCopies > 0 ? 'success' : 'error'}
                    />
                  </Box>

                  {book.tags && book.tags.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      {book.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        ISBN
                      </Typography>
                      <Typography variant="body1">
                        {book.isbn}
                      </Typography>
                    </Grid>
                    {book.publishedYear && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Published Year
                        </Typography>
                        <Typography variant="body1">
                          {book.publishedYear}
                        </Typography>
                      </Grid>
                    )}
                    {book.pages && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Pages
                        </Typography>
                        <Typography variant="body1">
                          {book.pages}
                        </Typography>
                      </Grid>
                    )}
                    {book.publisher && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Publisher
                        </Typography>
                        <Typography variant="body1">
                          {book.publisher}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                  {book.description && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Description
                      </Typography>
                      <Typography variant="body1">
                        {book.description}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Similar Books Sidebar */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Similar Books You May Like
              </Typography>
              {similarLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : similarBooks.length > 0 ? (
                <List>
                  {similarBooks.map((similarBook) => (
                    <ListItem
                      key={similarBook._id}
                      component={Link}
                      to={`/books/${similarBook._id}`}
                      sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <Avatar
                        src={similarBook.coverImage || '/placeholder-book.jpg'}
                        alt={similarBook.title}
                        sx={{ width: 40, height: 60, mr: 2, borderRadius: 1 }}
                        variant="square"
                      />
                      <ListItemText
                        primary={similarBook.title}
                        secondary={similarBook.author}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }
                        }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No similar books found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookDetails;
