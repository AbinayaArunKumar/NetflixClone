import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext'; // Import UserAuth to use the context

const LoginAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { logInAdmin } = UserAuth(); // Get logInAdmin from context

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null); // Clear any previous errors
        try {
            await logInAdmin(email, password); // Call logInAdmin directly
            navigate('/admin/dashboard'); // Redirect to Admin Dashboard upon success
        } catch (err) {
            console.error('Error logging in:', err);
            setError(err.message || 'Login failed'); // Set error message from the thrown error
        }
    };

    return (
        <div style={styles.outerContainer}>
            <div style={styles.container}>
                <h2 style={styles.title}>Admin Login</h2>
                <form onSubmit={handleLogin} style={styles.form}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>Login</button>
                </form>
                {error && <p style={styles.error}>{error}</p>}
            </div>
        </div>
    );
};

const styles = {
    outerContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'black',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '400px',
        padding: '60px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#222',
    },
    title: {
        textAlign: 'center',
        color: '#fff',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%', // Adjusted to 100% to fit container
    },
    input: {
        marginBottom: '15px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#333',
        color: '#fff',
    },
    button: {
        padding: '10px',
        backgroundColor: '#e50914',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
};

export default LoginAdmin;
