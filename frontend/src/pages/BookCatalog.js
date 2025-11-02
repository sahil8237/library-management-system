import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Box,
  Chip,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [author, setAuthor] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [authorQuery, setAuthorQuery] = useState('');

  const fetchBooks = useCallback(async (searchTerm, authorTerm, pageNum) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pageNum,
        limit: 12
      });

      if (searchTerm) params.append('search', searchTerm);
      if (authorTerm) params.append('author', authorTerm);

      const response = await axios.get(`http://localhost:5000/api/books?${params}`);
      setBooks(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks(searchQuery, authorQuery, page);
  }, [fetchBooks, searchQuery, authorQuery, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(search);
    setAuthorQuery(author);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading && books.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Book Catalog
      </Typography>

      {/* Search Form */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search books"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, or ISBN"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Filter by author"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ height: '56px' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Books Grid */}
      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="300"
                image={book.coverImage || '/placeholder-book.jpg'}
                alt={book.title}
                sx={{ objectFit: 'contain', objectPosition: 'center' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2" sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  by {book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ISBN: {book.isbn}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={`${book.availableCopies} of ${book.totalCopies} available`}
                    color={book.availableCopies > 0 ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  to={`/books/${book._id}`}
                  variant="outlined"
                  fullWidth
                >
                  View Details
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {books.length === 0 && !loading && (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          No books found.
        </Typography>
      )}
    </Container>
  );
};

export default BookCatalog;
