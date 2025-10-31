
import { useNavigate } from 'react-router';
import './profile.css';

export const Profile = () => {
  const { user,  logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();         // limpia el user
    navigate("/");    // redirige a la root
  };

  if (!user) {
    navigate('/');
    return null;
  }
  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-info">
        <p>Welcome, {user.nombre}!</p>
        <p>User ID: {user.id}</p>
        <p>Status: {}</p>
      </div>
      <div className="profile-actions">
        <button 
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

