  import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Alert,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Add, Edit, Delete, Upload } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminBookManagement = () => {
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    publishedYear: '',
    pages: '',
    totalCopies: 1,
    tags: '',
    status: 'available'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingBookId, setUploadingBookId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('/api/books?limit=1000');
      setBooks(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch books');
    }
  };

  const handleOpen = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: book.description || '',
        publishedYear: book.publishedYear || '',
        pages: book.pages || '',
        totalCopies: book.totalCopies,
        tags: book.tags ? book.tags.join(', ') : '',
        status: book.status || 'available'
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        description: '',
        publishedYear: '',
        pages: '',
        totalCopies: 1
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBook(null);
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingBook) {
        await axios.put(`/api/books/${editingBook._id}`, formData);
        toast.success('Book updated successfully');
      } else {
        await axios.post('/api/books', formData);
        toast.success('Book created successfully');
      }
      fetchBooks();
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/api/books/${id}`);
        toast.success('Book deleted successfully');
        fetchBooks();
      } catch (err) {
        toast.error('Failed to delete book');
      }
    }
  };

  const handleFileUpload = async (bookId) => {
    if (!selectedFile) return;

    const formDataUpload = new FormData();
    formDataUpload.append('coverImage', selectedFile);

    setUploadingBookId(bookId);
    try {
      await axios.put(`/api/books/${bookId}/cover`, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Cover image uploaded successfully');
      fetchBooks();
      setSelectedFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
    setUploadingBookId(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Admin Book Management
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            sx={{ mr: 2 }}
          >
            Add Book
          </Button>
          <Button variant="outlined" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cover</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Copies</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book._id}>
                <TableCell>
                  {book.coverImage ? (
                    <img
                      src={book.coverImage.startsWith('http') ? book.coverImage : `http://localhost:5000${book.coverImage}`}
                      alt={book.title}
                      style={{ width: 50, height: 70, objectFit: 'cover' }}
                    />
                  ) : (
                    'No cover'
                  )}
                </TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.totalCopies}</TableCell>
                <TableCell>{book.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(book)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(book._id)} color="error">
                    <Delete />
                  </IconButton>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id={`upload-${book._id}`}
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                  <label htmlFor={`upload-${book._id}`}>
                    <IconButton component="span" color="secondary">
                      <Upload />
                    </IconButton>
                  </label>
                  {selectedFile && (
                    <Button
                      size="small"
                      onClick={() => handleFileUpload(book._id)}
                      disabled={uploadingBookId === book._id}
                    >
                      {uploadingBookId === book._id ? 'Uploading...' : 'Upload'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Book Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBook ? 'Edit Book' : 'Add New Book'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Author"
                  name="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ISBN"
                  name="isbn"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Published Year"
                  name="publishedYear"
                  type="number"
                  value={formData.publishedYear}
                  onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pages"
                  name="pages"
                  type="number"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Copies"
                  name="totalCopies"
                  type="number"
                  value={formData.totalCopies}
                  onChange={(e) => setFormData({ ...formData, totalCopies: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tags (comma-separated)"
                  name="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="fiction, mystery, thriller"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="borrowed">Borrowed</MenuItem>
                    <MenuItem value="reserved">Reserved</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? 'Saving...' : (editingBook ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminBookManagement;
