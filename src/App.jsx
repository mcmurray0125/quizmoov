import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Quiz from './Quiz';
import Results from './components/Results';



function App() {
  return (
          <Router>
            <AuthProvider>
              <Routes>
                <Route exact path='/' element={<PrivateRoute><Quiz/></PrivateRoute>} />
                <Route path='/results' element={<PrivateRoute><Results/></PrivateRoute>} />
                <Route path='/login' element={<Login/>} />
              </Routes>
            </AuthProvider>
          </Router>
  );
}

export default App;