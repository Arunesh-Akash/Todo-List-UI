import { Button, TextField } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import { FcGoogle } from 'react-icons/fc';
import FacebookIcon from '@mui/icons-material/Facebook';
import todo from '../../Picture/Todo.jpg'
import Snackbar from '@mui/material/Snackbar';
import './SignUp.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

function SignUp() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSign, setOpenSign] = useState(false);
  const [openLogin, setOpenLogin] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  const handleCloseSign = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSign(false);
  };
  const handleCloseLogin = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenLogin(false);
  };
  function handleToggle() {
    setIsSignUp(!isSignUp);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSignUp) {
      await axios.post('http://localhost:4500/user/signup', { name, email, password }).then((response) => {
        console.log(response.data);
        setName('');
        setEmail('');
        setPassword('');
        setSnackbarMessage(response.data.message);
        setOpenSign(true);
      }).catch((err) => {
        console.error(err);
        setSnackbarMessage(err.response.data.message);
        setOpenSign(true);
      })
    }
    else {
      await axios.post('http://localhost:4500/user/login', { email, password }).then((response) => {
        console.log(response.data);
        setEmail('');
        setPassword('');
        setSnackbarMessage(response.data.successResponse.message);
        setOpenLogin(true);
        localStorage.setItem('token', response.data.token);
        setTimeout(() => {
          navigate('/home');

        }, 2000);
      }).catch((err) => {
        console.error(err);
        setEmail('');
        setPassword('');
        setSnackbarMessage(err.response.data.message);
        setOpenLogin(true);
      })

    }
  }

  return (
    <div className='main-container'>
      <div className='img-container'>
        <img src={todo} alt='' />
      </div>
      <div className='form-container'>
        <h1>Welcome to Checklist</h1>
        <span>Kindly fill your personal details and get started!</span>
        <form onSubmit={handleSubmit}>
          {
            isSignUp ? <><TextField id="outlined-basic" label="Username" value={name} type='text' style={{ width: '26rem', marginTop: '55px' }} InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <PersonOutlinedIcon />
                </InputAdornment>
              ),
            }} onChange={(e) => setName(e.target.value)} />
              <TextField id="outlined-basic" label="Email" type="email" value={email} style={{ width: '26rem', marginTop: '1rem' }} InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }} onChange={(e) => setEmail(e.target.value)} />
            </> : <TextField id="outlined-basic" label="Email" type='email' value={email} style={{ width: '26rem', marginTop: '86px' }} InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EmailIcon />
                </InputAdornment>
              ),
            }} onChange={(e) => setEmail(e.target.value)} />
          }
          <TextField id="outlined-password-input" label="Password" value={password} type="password" style={{ marginTop: '1rem' }} InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <LockOutlinedIcon />
              </InputAdornment>
            ),
          }} onChange={(e) => setPassword(e.target.value)} />
          <div className='checkbox-container'>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Remember Me" />
            <span>Forgot Password?</span>
          </div>
          {
            isSignUp ? <>
              <Button variant="contained" type='submit'>
                Sign Up
              </Button> <Snackbar
                open={openSign}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                autoHideDuration={2000}
                onClose={handleCloseSign}
                message={snackbarMessage}
              /> </> :
              <><Button variant="contained" type='submit'>
                Login
              </Button> <Snackbar
                  open={openLogin}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  autoHideDuration={1000}
                  onClose={handleCloseLogin}
                  message={snackbarMessage}
                />
              </>
          }

          <div className='other-container'>
            <hr />
            <span className='or-text'>Or</span>
            <hr />
          </div>
          <div className='google-container'>
            <Button variant='contained' style={{ backgroundColor: 'white', color: 'black' }}><FcGoogle className='google-icon' />Google</Button>
            <Button variant='contained' style={{ backgroundColor: '#4267B2' }}><FacebookIcon />Facebook</Button>
          </div>
        </form>
        <div className='footer-container'>
          <p>Don't have an account?<span onClick={handleToggle}>{isSignUp ? 'Login' : 'Register Now'}</span></p>
        </div>
      </div>
    </div>
  )
}

export default SignUp;