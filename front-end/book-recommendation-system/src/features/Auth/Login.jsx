import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/userService';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me"
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Use login function from context

  // Load saved credentials (if any) when the component mounts
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
    setRememberMe(savedRememberMe); // Check the "Remember Me" box if previously checked
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser(email, password); // Call login API

      // Save token persistently or temporarily based on "Remember Me"
      if (rememberMe) {
        localStorage.setItem('authToken', data.token); // Persistent login
        localStorage.setItem('rememberedEmail', email); // Save email
        localStorage.setItem('rememberedPassword', password); // Save password (optional)
        localStorage.setItem('rememberMe', true); // Save "Remember Me" state
      } else {
        sessionStorage.setItem('authToken', data.token); // Session-only login
        localStorage.removeItem('rememberedEmail'); // Clear saved email
        localStorage.removeItem('rememberedPassword'); // Clear saved password
        localStorage.removeItem('rememberMe'); // Clear "Remember Me" state
      }

      // Use the context's login function to update global state
      login(data.token);

      // Redirect the user to the books page
      navigate('/books');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* Remember Me Checkbox */}
        <div>
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
