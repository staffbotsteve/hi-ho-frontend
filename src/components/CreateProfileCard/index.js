import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import SubmitBtn from '../SubmitBtn';
import Card from '@material-ui/core/Card';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [minSalary, setMinSalary] = useState("");

  const clearInput = (inputs) => {
    inputs.forEach(input => input(""));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = process.env.REACT_APP_API_URL;
    console.log("url", url)

    if(firstName === "" || lastName === "" || email === "" || password === "" || confirmPassword === "" || jobTitle === "" || minSalary === ""){
      toast.error("Please fill all required field(s)")
    }

    if(password !== "" && password.length < 6){
      toast.error("Password cannot be less than 6 characters")
    }
    if(password !== "" && password !== confirmPassword){
      toast.error("Passwords do not match")
    }

    fetch(`${url}/register`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        firstName, lastName, email, phone, password, jobTitle, minSalary
      })
    })
    .then(res =>  res.json())
    .then(data => {
      if(data.success){
        console.log("data", data)
      toast.success("account created successfully")

      const inputs = [setFirstName, setLastName, setEmail, setPhone, setPassword, setConfirmPassword, setJobTitle, setMinSalary];
      clearInput(inputs)
      }
    })
  }

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
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
        />
        <TextField
          required
          id="outlined-required"
          label="Last Name"
          placeholder="Last Name"
          variant="outlined"
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
        />
         <TextField
          required
          id="outlined-required"
          label="Email"
          placeholder="hello@email.com"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <TextField
          required
          id="outlined-password-input"
          label="Password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
         <TextField
          required
          id="outlined-password-input"
          label="Confirm Password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          variant="outlined"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
         <TextField
          required
          id="outlined-required"
          label="Phone Number"
          placeholder="123-456-7890"
          variant="outlined"
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
        />
         <TextField
          required
          id="outlined-required"
          label="Job Title"
          placeholder="Job Title"
          variant="outlined"
          onChange={(e) => setJobTitle(e.target.value)}
          value={jobTitle}
        />
         <TextField
          required
          id="outlined-required"
          label="Minimum Salary"
          placeholder="Minimum Salary"
          variant="outlined"
          onChange={(e) => setMinSalary(e.target.value)}
          value={minSalary}
        />
        {/* <PhoneNumberCard /> */}
        <SubmitBtn handleSubmit={handleSubmit} >Create Profile</SubmitBtn>
        </Card>
      </div>
    </form>
  );
}
