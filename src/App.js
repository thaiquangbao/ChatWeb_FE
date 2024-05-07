/* import logo from './logo.svg'; */

import './App.css';
import Home from './pages/home/home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import { SignUp } from './pages/signUp/signUp';
import { UiFirst } from './pages/ui-one/ui-first';
import { OTPConfirmationForm } from './pages/vertify/OTPConfirmationForm';
import { UiCloud } from './pages/cloud/cloud';
import React, { useState } from 'react';
import { RequireAuth } from './component/AuthenticatedRouter';
import { AuthContext } from './untills/context/AuthContext';
import SignupContext from './untills/context/SignupContext';
import {UiContact} from './pages/contact/contact';
import { SocketContext, socket } from './untills/context/SocketContext';
import { UserProvider } from './pages/ui-one/component/findUser';
import { UpdateInformation } from './pages/update_information/update_information';
import { UpdatePassword } from './pages/update_password/update_password';
import { DeleteAccount } from './pages/delete_account/delete_account';
import { VideoCall } from './component/video-call/VideoCall';
import { VoiceCall } from './component/voice-call/VoiceCall';
import { VideoCallGroup } from './component/call-group/video-call-group';
import Forgot from './pages/forgot/forgot';

function App() {
  const [user, setUser] = useState();
  return (
    <AuthContext.Provider value={{ user, updateAuthUser: setUser }}>
      <SignupContext>
        <SocketContext.Provider value={socket}>
          <BrowserRouter>
            <Routes>

              <Route path="/" Component={Home} />
              <Route path="/forgot" Component={Forgot} />
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
                  <UserProvider>
                   
                      
                            <UiFirst />
                          
                   
                  </UserProvider>
                </RequireAuth>
              }
              />
              <Route path="/video_call/:id/:fullName" element={
                  <RequireAuth>
                    <VideoCall />
                  </RequireAuth>
                } 
              />
               <Route path="/voice_call/:id/:fullName" element={
                  <RequireAuth>
                    <VoiceCall />
                  </RequireAuth>
                } 
              />
               <Route path="/video_call_group/:id/:fullName/:members" element={
                  <RequireAuth>
                    <VideoCallGroup />
                  </RequireAuth>
                } 
              />

              <Route path="/cloud" element={
                <RequireAuth>
                  <UiCloud/>
                </RequireAuth>
              } />
              <Route path="/contact" element={
                <RequireAuth>
                  <UiContact/>
                </RequireAuth>
              } />
              <Route path="/update_information/:id" element={

                <RequireAuth>
                  <UpdateInformation />
                </RequireAuth>} />

              <Route path="/update_password/:id" element={

                <RequireAuth>
                  <UpdatePassword />
                </RequireAuth>} />

              <Route path="/delete_account/:id" element={

                <RequireAuth>
                  <DeleteAccount />
                </RequireAuth>} />
            </Routes>
          </BrowserRouter>
        </SocketContext.Provider>
      </SignupContext>
    </AuthContext.Provider>
  );
}


export default App;

