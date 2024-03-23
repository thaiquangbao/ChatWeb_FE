import { useAuth } from '../untills/hooks/useAuth'; 
import { Navigate, useLocation } from 'react-router-dom';
import './Loading.scss'


export const RequireAuth = ({ children } ) => {
    const location = useLocation();
   const { loading, user } = useAuth()
    if (loading) {
      return <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading...</div>
            </div>
    } 
    if (user) return <>{children}</>;
    return <Navigate to="/login" state={{from: location}} replace />;
  };
