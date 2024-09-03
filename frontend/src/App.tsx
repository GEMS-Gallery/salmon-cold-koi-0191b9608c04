import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { AppBar, Toolbar, Typography, Container, Button, Card, CardContent, CircularProgress, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '', author: '' });

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
      await backend.createPost(newPost.title, newPost.body, newPost.author);
      setOpenDialog(false);
      setNewPost({ title: '', body: '', author: '' });
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Crypto Blog
          </Typography>
        </Toolbar>
      </AppBar>

      <div className="hero bg-blue-600 text-white py-16 mb-8">
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Crypto Blog
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Explore the latest insights in the world of cryptocurrency
          </Typography>
          <img
            src="https://images.unsplash.com/photo-1643546352163-0f801330e91c?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjUzOTIwMTZ8&ixlib=rb-4.0.3"
            alt="Cryptocurrency"
            className="mt-4 rounded-lg shadow-lg w-full"
          />
          <Typography variant="caption" display="block" gutterBottom>
            Photo by <a href="https://unsplash.com/photos/a-blue-number-five-surrounded-by-icons--8wKJmsNDtw" target="_blank" rel="noopener noreferrer" className="text-white underline">Unsplash</a>
          </Typography>
        </Container>
      </div>

      <Container maxWidth="md">
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              className="mb-4"
            >
              Create Post
            </Button>
            {posts.map((post) => (
              <Card key={Number(post.id)} className="mb-4">
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    By {post.author} | {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
                  </Typography>
                  <Typography variant="body1">{post.body}</Typography>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </Container>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Author"
            fullWidth
            variant="outlined"
            value={newPost.author}
            onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Body"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreatePost} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default App;
