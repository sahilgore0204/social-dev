import { Fragment } from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Login from './components/auth/Login';
function App() {
  return (
    <Fragment>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Landing/>} exact/>
          <Route path='/register' element={<Register/>} />
          <Route path='/login' element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
