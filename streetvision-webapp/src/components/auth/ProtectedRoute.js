import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('jwtToken');
  return token ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
