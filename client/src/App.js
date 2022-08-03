import React,{useState} from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import Login from './components/auth/Login';
import AuthContext from './components/context/auth-context';
import DashBoard from './components/Dashboard';
import CreateProfile from './components/Create/CreateProfile';
import AddEducation from './components/Create/AddEducation';
import AddExperience from './components/Create/AddExperience';
import Logout from './components/auth/Logout';
import Developers from './components/View/Developers';
import Posts from './components/View/Posts';
import Post from './components/View/Post';
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
            <Route path='/edit-profile' element={<CreateProfile/>} />
            <Route path='/add-experience' element={<AddExperience/>} />
            <Route path='/add-education' element={<AddEducation/>} />
            <Route path='/profiles' element={<Developers/>} />
            <Route path='/posts' element={<Posts/>} />
            <Route path='/logout' element={<Logout/>} />
            <Route path='/post/:post_id' element={<Post/>} />
          </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
  );
}

export default App;
