import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { AppBar, Toolbar, Typography, Container, Button, Card, CardContent, CircularProgress, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string;
  category: string;
  timestamp: bigint;
}

const categories = [
  'Ethical Hacking',
  'Cybersecurity',
  'Network Security',
  'Web Security',
  'Cryptography',
  'Malware Analysis',
  'Social Engineering',
  'Penetration Testing',
  'Forensics',
  'Reverse Engineering'
];

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '', author: '', category: '' });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      setLoading(true);
      await backend.createPost(newPost.title, newPost.body, newPost.author, newPost.category);
      setOpenDialog(false);
      setNewPost({ title: '', body: '', author: '', category: '' });
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: '"Courier New", Courier, monospace' }}>
            Hacker's Blog
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" className="mt-8">
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontFamily: '"Courier New", Courier, monospace', color: 'black' }}>
          Welcome to Hacker's Blog
        </Typography>
        <Typography variant="h5" component="p" gutterBottom sx={{ fontFamily: '"Courier New", Courier, monospace', color: 'gray' }}>
          Explore the latest insights in the world of hacking and cybersecurity
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              className="mb-4 mt-4"
              sx={{ backgroundColor: 'black', '&:hover': { backgroundColor: 'gray' } }}
            >
              Create Post
            </Button>
            {posts.map((post) => (
              <Card key={Number(post.id)} className="mb-4" sx={{ backgroundColor: '#f0f0f0', border: '1px solid black' }}>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom sx={{ fontFamily: '"Courier New", Courier, monospace', color: 'black' }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontFamily: '"Courier New", Courier, monospace' }}>
                    By {post.author} | Category: {post.category} | {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: '"Courier New", Courier, monospace', color: 'black' }}>{post.body}</Typography>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </Container>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ fontFamily: '"Courier New", Courier, monospace' }}>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { fontFamily: '"Courier New", Courier, monospace' } }}
          />
          <TextField
            margin="dense"
            label="Author"
            fullWidth
            variant="outlined"
            value={newPost.author}
            onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { fontFamily: '"Courier New", Courier, monospace' } }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              sx={{ fontFamily: '"Courier New", Courier, monospace' }}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Body"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { fontFamily: '"Courier New", Courier, monospace' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: 'black' }}>Cancel</Button>
          <Button onClick={handleCreatePost} variant="contained" sx={{ backgroundColor: 'black', '&:hover': { backgroundColor: 'gray' } }}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default App;
