import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Wrapper from "./components/Wrapper"
import CreateProfile from './pages/CreateProfile';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from './pages/Home'

function App() {
  return (
    <div>
      <ToastContainer />
      <Header />
      <Wrapper>
      <CreateProfile />
      <Home />
      </Wrapper>
      <Footer />
    </div>


  );
}

export default App;
