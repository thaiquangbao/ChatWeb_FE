/* import logo from './logo.svg'; */
import './App.css';
import Home from './pages/home/home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import { SignUp } from './pages/signUp/signUp';
import { UiFirst } from './pages/ui-one/ui-first';
import { OTPConfirmationForm } from './pages/vertify/OTPConfirmationForm';
import UiCloud from './pages/cloud/cloud';
import React, { useState } from 'react';
import { RequireAuth } from './component/AuthenticatedRouter';
import { AuthContext } from './untills/context/AuthContext';
import SignupContext from './untills/context/SignupContext';
import UiContact from './pages/contact/contact';
import { SocketContext, socket } from './untills/context/SocketContext';

function App() {
  const [user, setUser] = useState();
  return (
    <AuthContext.Provider value={{ user, updateAuthUser: setUser }}>
      <SignupContext>
        <SocketContext.Provider value={socket}>
          <BrowserRouter>
            <Routes>

              <Route path="/" Component={Home} />
              <Route path="/signup" element={

                <SignUp />

              } />
              <Route path="/vertify"
                element={

                  <OTPConfirmationForm />

                }
              />
              <Route path="/login" Component={Login} />
              <Route path="/page" element={
                <RequireAuth>
                  <UiFirst />
                </RequireAuth>
              }
              />
              <Route path="/cloud" Component={UiCloud} />
              <Route path="/contact" Component={UiContact} />
            </Routes>
          </BrowserRouter>
        </SocketContext.Provider>  
      </SignupContext>
    </AuthContext.Provider>
  );
}


export default App;

