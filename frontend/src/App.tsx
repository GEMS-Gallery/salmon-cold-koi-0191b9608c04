import React, { useState, useEffect, useMemo } from 'react';
import { backend } from 'declarations/backend';
import { AppBar, Toolbar, Typography, Container, Button, Card, CardContent, CircularProgress, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SecurityIcon from '@mui/icons-material/Security';
import CodeIcon from '@mui/icons-material/Code';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import BugReportIcon from '@mui/icons-material/BugReport';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import ComputerIcon from '@mui/icons-material/Computer';
import LockIcon from '@mui/icons-material/Lock';
import MemoryIcon from '@mui/icons-material/Memory';
import PublicIcon from '@mui/icons-material/Public';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string;
  category: string;
  timestamp: bigint;
}

const categories = [
  { name: 'All Categories', icon: <AllInclusiveIcon /> },
  { name: 'Ethical Hacking', icon: <SecurityIcon /> },
  { name: 'Cybersecurity', icon: <LockIcon /> },
  { name: 'Network Security', icon: <PublicIcon /> },
  { name: 'Web Security', icon: <CodeIcon /> },
  { name: 'Cryptography', icon: <VpnKeyIcon /> },
  { name: 'Malware Analysis', icon: <BugReportIcon /> },
  { name: 'Social Engineering', icon: <GroupIcon /> },
  { name: 'Penetration Testing', icon: <SearchIcon /> },
  { name: 'Forensics', icon: <ComputerIcon /> },
  { name: 'Reverse Engineering', icon: <MemoryIcon /> },
  { name: 'General', icon: <SecurityIcon /> }
];

interface CategoryListProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ selectedCategory, onCategorySelect }) => (
  <div className="flex flex-wrap justify-center mb-4">
    {categories.map((category) => (
      <Chip
        key={category.name}
        icon={category.icon}
        label={category.name}
        onClick={() => onCategorySelect(category.name === 'All Categories' ? '' : category.name)}
        variant={selectedCategory === (category.name === 'All Categories' ? '' : category.name) ? "filled" : "outlined"}
        className="m-1"
        sx={{ fontFamily: '"Courier New", Courier, monospace' }}
      />
    ))}
  </div>
);

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '', author: '', category: '' });
  const [selectedCategory, setSelectedCategory] = useState('');

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

  const filteredPosts = useMemo(() => {
    return selectedCategory
      ? posts.filter(post => post.category === selectedCategory)
      : posts;
  }, [posts, selectedCategory]);

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

        <CategoryList selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />

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
            {filteredPosts.map((post) => (
              <Card key={Number(post.id)} className="mb-4" sx={{ backgroundColor: '#f0f0f0', border: '1px solid black' }}>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom sx={{ fontFamily: '"Courier New", Courier, monospace', color: 'black' }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontFamily: '"Courier New", Courier, monospace' }}>
                    By {post.author} | Category: {post.category} | {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: '"Courier New", Courier, monospace', color: 'black' }}>
                    {post.body}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </Container>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
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
              {categories.filter(category => category.name !== 'All Categories').map((category) => (
                <MenuItem key={category.name} value={category.name}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Body"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
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
