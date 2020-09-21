import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import SubmitBtn from "../SubmitBtn";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
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

  const clearInput = (inputs) => {
    inputs.forEach((input) => input(""));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = process.env.REACT_APP_API_URL;

    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      toast.error("Please fill all required field(s)");
    }

    if (password !== "" && password.length < 6) {
      toast.error("Password cannot be less than 6 characters");
    }
    if (password !== "" && password !== confirmPassword) {
      toast.error("Passwords do not match");
    }

    fetch(`${url}/register`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        password,
      }),
    })
      .then((res) => {
        res.json().then((data) => {
          if (data.err === "Email already exists") {
            toast.error("Email already exists");
          } else {
            console.log("data", data);
            toast.success("account created successfully");
            localStorage.setItem("token", data.token);

            const inputs = [
              setFirstName,
              setLastName,
              setEmail,
              setPhone,
              setPassword,
              setConfirmPassword,
            ];
            clearInput(inputs);
            window.location = "/";
          }
        });
      })
      .catch((err) => {
        if (err) {
          console.log("err", err);
        }
      });
  };

  return (
    <form
      id="profileCard"
      onSubmit={handleSubmit}
      className={classes.root}
      noValidate
      autoComplete="off"
    >
      <h1 className="loginTitle">Welcome to Hi Ho</h1>
      <img src={process.env.PUBLIC_URL + '/images/hihowhite.png'} className="loginLogo" alt="hiho" /> 
      <h3>REGISTER</h3>
      <div>
        {/* <Card className={classes.root}> */}
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
      </div>
      <div>
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
          id="outlined-required"
          label="Phone Number"
          placeholder="123-456-7890"
          variant="outlined"
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
        />
      </div>
      <div>
        

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
      </div>
      <br></br>
      <SubmitBtn type="submit" handleSubmit={handleSubmit}>
        Create Profile
      </SubmitBtn>
      {/* </Card> */}
    </form>
  );
}
