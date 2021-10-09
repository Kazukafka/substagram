import React, { useState, useEffect } from 'react'
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
//import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //User has logged IN
        console.log(authUser);
        setUser(authUser);
        //↑ is keep user logged in after refresh
      } else {
        //User has logged OUT
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup actions
      unsubscribe(null);
    }
  }, [user, username]);

  //useEffect => where the code runs, last []) means the code runs only once
  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  //signup func
  const signup = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  }

  //signin func
  const signin = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }

  return (
    <div className="App">
      <div className="app__header">

        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="HeaderImage"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>SignIn</Button>
            <Button onClick={() => setOpen(true)}>SignUp</Button>
          </div>
        )}
        <Modal
          open={open}
          onClose={() => setOpen(false)}
        >
          <Box sx={style}>
            <form className="app__signup">
              <center>
                <img
                  className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt="HeaderImage"
                />
              </center>
              <Input
                type="text"
                placeholder="username"
                //at first, ↓ was value={username}, but typing cannot be shown on the screen in that case,
                //https://stackoverflow.com/questions/34006333/cant-type-in-react-input-text-field
                //↑is the trouble shooting, which says try defaultValue instead of value(V is capital).
                defaultValue={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="text"
                placeholder="email"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="text"
                placeholder="password"
                defaultValue={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <center>
                <Button type="submit" onClick={signup}>SignUp</Button>
              </center>
            </form>

          </Box>
        </Modal>

        <Modal
          //signupModal
          open={openSignIn}
          onClose={() => setOpenSignIn(false)}
        >
          <Box sx={style}>
            <form className="app__signup">
              <center>
                <img
                  className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt="HeaderImage"
                />
              </center>

              <Input
                type="text"
                placeholder="email"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="text"
                placeholder="password"
                defaultValue={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <center>
                <Button type="submit" onClick={signin}>SignIn</Button>
              </center>
            </form>

          </Box>
        </Modal>
      </div>

      <h1>TEST</h1>
      {/* header */}
      {
        posts.map(({ id, post }) => (
          <Post username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
        ))
      }

      {/* post */}
      {/* post */}
    </div >
  );
}

export default App;

