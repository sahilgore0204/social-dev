import React,{useState} from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import Login from './components/auth/Login';
import AuthContext from './components/context/auth-context';
import DashBoard from './components/Dashboard';
function App() {
  let [jwt,setJwt]=useState('');
  return (
      <BrowserRouter>
        <AuthContext.Provider value={{jwt,setJwt}}>
          <Navbar/>
          <Routes>
            <Route path="/" exact element={<Landing/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/dashboard' element={<DashBoard/>} />
          </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
  );
}

export default App;
