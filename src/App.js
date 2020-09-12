import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import CreateProfileCard from './components/CreateProfileCard';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from './pages/Home'

function App() {
  return (
    <div>
      <ToastContainer />
      <Header />
      <CreateProfileCard />
      <Home />
      <Footer />
    </div>


  );
}

export default App;
