import { useContext, useEffect, useState } from 'react';
import { getAuthUser } from '../api';
import { AuthContext } from '../context/AuthContext';
import { globalContext } from '../../component/context/globalContext';
import { statusMessage } from '../../component/notification';
export function useAuth() {

  const [loading, setLoading] = useState(true);
  const { user, updateAuthUser } = useContext(AuthContext);
  const controller = new AbortController();
  const { handler } = useContext(globalContext)
  useEffect(() => {
    getAuthUser()
      .then(({ data }) => {
        updateAuthUser(data.auth);

        setTimeout(() => setLoading(false), 3000)

      })
      .catch((err) => {
        handler.setProp({ status: statusMessage.FAIL, message: 'Before Login' })
        setTimeout(() => setLoading(false), 3000)
      });
    return () => {
      controller.abort();
    }
  }, []);
  return { user, loading };
}