import React, {useState} from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";

import FormControl from "@material-ui/core/FormControl";

import InputBase from "@material-ui/core/InputBase";
import SubmitBtn from "../SubmitBtn";

import "./style.css"

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function Login() {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const clearInput = (inputs) => {
    inputs.forEach((input) => input(""));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = process.env.REACT_APP_API_URL;
    console.log("url", url);

    fetch(`${url}/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("data", data);
          toast.success("logged in successfully");
          localStorage.setItem("token", data.token)

          const inputs = [setEmail, setPassword];
          clearInput(inputs);

          window.location = "/"
        } else {
          toast.error("Invalid Login");
        }
      });
  };

  return (
    <div>
      
    <form  style={{textAlign: "center", marginTop: "40px"}} onSubmit={handleSubmit}>
    <h1 className="loginTitle">Welcome to Hi Ho</h1>
    <h3>Your Job Search Site</h3>
      <img src={process.env.PUBLIC_URL + '/images/hihowhite.png'} className="loginLogo" alt="hiho" /> 
      <h3>LOGIN</h3>
      <div>
      <FormControl className={classes.margin}>
        <BootstrapInput
          id="demo-customized-textbox"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      </div>
      <div>
      <FormControl className={classes.margin}>
        <BootstrapInput
          id="demo-customized-textbox"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
      </FormControl>
      </div>
      <div>
      <SubmitBtn type="submit" handleSubmit={handleSubmit}>Login</SubmitBtn>
      </div>
    </form>
    </div>
  );
}
