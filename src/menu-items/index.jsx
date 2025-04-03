import useAuth from 'hooks/useAuth';
import getMenuForUser from './menuSelector';

const useMenuItems = () => {
  const { user } = useAuth();
  return getMenuForUser(user);
};

export default useMenuItems;
