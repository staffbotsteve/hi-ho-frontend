import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import PhoneNumberCard from '../PhoneNumberInput';
import SubmitBtn from '../SubmitBtn';
import Card from '@material-ui/core/Card';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function CreateProfileCard() {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
     
      <div>
      <Card className={classes.root}> 
        <TextField
          required
          id="outlined-required"
          label="First Name"
          placeholder="First Name"
          variant="outlined"
        />
        <TextField
          required
          id="outlined-required"
          label="Last Name"
          placeholder="Last Name"
          variant="outlined"
        />
         <TextField
          required
          id="outlined-required"
          label="Email"
          placeholder="hello@email.com"
          variant="outlined"
        />
        <TextField
          required
          id="outlined-password-input"
          label="Password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          variant="outlined"
        />
         <TextField
          required
          id="outlined-password-input"
          label="Confirm Password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          variant="outlined"

        />
        <PhoneNumberCard />
        <SubmitBtn />
        </Card>
      </div>
    </form>
  );
}
