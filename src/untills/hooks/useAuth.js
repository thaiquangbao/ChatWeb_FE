import { useContext, useEffect, useState } from 'react';
import { getAuthUser } from '../api';
import { AuthContext } from '../context/AuthContext';
import { globalContext } from '../../component/context/globalContext';
import { statusMessage } from '../../component/notification';
export function useAuth() {

  const [loading, setLoading] = useState(true);
  const { user, updateAuthUser } = useContext(AuthContext);
  const controller = new AbortController();
  useEffect(() => {
    getAuthUser()
      .then(({ data }) => {
        data.auth.cookie = data.cookie
        updateAuthUser(data.auth);

        setTimeout(() => {
          setLoading(false);
          //window.location.reload();
        }, 3000);
         // Reload trang sau khi setTimeOut kết thúc
      })
      .catch((err) => {
        setTimeout(() => setLoading(false), 3000)
      });
    return () => {
      controller.abort();
    }
  }, []);
  return { user, loading };
}