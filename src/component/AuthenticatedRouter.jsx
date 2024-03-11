import { useAuth } from '../untills/hooks/useAuth'; 
import { Navigate, useLocation } from 'react-router-dom';



export const RequireAuth = ({ children } ) => {
    const location = useLocation();
   const { loading, user } = useAuth()
    if (loading) {
      return <div>loading</div>
    } 
    if (user) return <>{children}</>;
    return <Navigate to="/login" state={{from: location}} replace />;
  };
