import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import CreateProfile from './pages/CreateProfile';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import { Switch, Route, Redirect } from "react-router-dom";
// import Login from "./components/Login";
import Login from "./components/login";

import jwtDecode from "jwt-decode";
import Profile from "./components/Profile";


function App() {
    const [token, setToken] = useState("");

    useEffect(() => {
        try {
            let token = localStorage.getItem("token");
            token = jwtDecode(token);
            setToken(token);
        } catch (ex) {}
    }, []);

    return ( <
        div >
        <
        ToastContainer / >


        <
        div className = "contentContainer" >
        <
        Header token = { token }
        /> <
        Switch >
        <
        Route path = "/profile"
        render = {
            (props) => {
                if (token !== "") return <Profile {...props }
                token = { token }
                />;
                return <Redirect to = "/Login" / > ;
            }
        }
        /> <
        Route path = "/Login"
        render = {
            (props) => {
                if (token === "") return <Login {...props }
                />;
                return <Redirect to = "/" / > ;
            }
        }
        /> <
        Route path = "/register"
        render = {
            (props) => {
                if (token === "") return <CreateProfile {...props }
                />;
                return <Redirect to = "/" / > ;
            }
        }
        /> <
        Route path = "/"
        render = {
            (props) => < Home {...props }
            token = { token }
            />}
            exact /
            > { /* <Route path="/profile" component={Profile} exact/> */ } <
            /Switch> <
            /div > <
            Footer / >
            <
            /div>
        );
    }

    export default App;