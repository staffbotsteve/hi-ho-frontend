import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Input from '../Input';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import GoogleMaps from '../GoogleMaps';




const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header() {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const clearInput = (inputs) => {
    inputs.forEach(input => input(""));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = process.env.REACT_APP_API_URL;
    console.log("url", url)

    fetch(`${url}/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        email, password,
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log("data", data)
          toast.success("logged in successfully")

          const inputs = [setEmail, setPassword];
          clearInput(inputs)
        } else{
          toast.error(data.error)
        }
      })
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
    
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
           Hi Ho
          </Typography>
          {/* <GoogleMaps /> */}
          <Input email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
          <Button color="inherit" onClick={handleSubmit}>Login</Button>

        </Toolbar>
      </AppBar>
    </div>
  );
}