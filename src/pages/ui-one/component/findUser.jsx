import React, { createContext, useContext, useState } from 'react';
import { findAuth } from '../../../untills/api';
import ErrorMicroInteraction from './giphy.gif'

const Modal = ({ message, onClose }) => (
  <div className="modal-overlay" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
    <div className="modal" style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '40px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)', animation: 'fadeIn 0.3s forwards', position: 'relative', width: '30%', height: '20%' }}>
      <div className="modal-content" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p>{message}</p>
        <img src={ErrorMicroInteraction} alt="" style={{ width: '190px', height: '120px' }} />

        <button style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'red', fontSize: '24px' }} onClick={onClose}>X</button>
      </div>
    </div>
  </div>
);
// Creating a context
const UserContext = createContext();

export const useUser = () => useContext(UserContext);

// Creating a provider
export const UserProvider = ({ children }) => {
  const [userFound, setUserFound] = useState([]);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const handleFindUser = async (phoneNumber) => {
    const data = { phoneNumber };
    try {
      const res = await findAuth(data);
      if (!res.data) {
        setErrorMessage('Không tìm thấy người dùng');
        setShowErrorModal(true);
        setTimeout(() => {
        setShowErrorModal(false);
          
        }, 2000);
      } else {
        // setUserFound(res.data);
        return res.data;
      }
    } catch (err) {
      setErrorMessage('Lỗi Server');
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
          
        }, 2000);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      <UserContext.Provider value={{ userFound, handleFindUser }}>
        {children}
      </UserContext.Provider>
      {/* Hiển thị modal error khi showErrorModal = true */}
      {showErrorModal && <Modal message={errorMessage} onClose={handleCloseErrorModal} />}
    </>
  );
};
