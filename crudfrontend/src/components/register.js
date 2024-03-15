import axios from "axios";
import { useState } from "react";

export const Register = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');

    const submit = async e => {
        e.preventDefault();
        try {
            const newUser = {
                email: email,
                first_name: firstName,
                last_name: lastName,
                password: password
            };

            // Make a POST request to register the new user
            const response = await axios.post(
                'http://localhost:8000/api/users/create',
                newUser,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const { data } = await axios.post(
                'http://localhost:8000/api/token/',
                newUser,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Initialize the access & refresh token in local storage.
            localStorage.clear();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;

            // Redirect to Home page
            window.location.href = '/home';
            console.log('New user registered successfully:', response.data);
            // Redirect to login page or perform other actions as needed
        } catch (error) {
            console.error('Error occurred during registration:', error);
            // Handle error here, such as displaying an error message to the user
        }
    };

    return (
        <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={submit}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Register</h3>
                    <div className="form-group mt-3">
                        <label>Email</label>
                        <input
                            className="form-control mt-1"
                            placeholder="Enter Email"
                            name='email'
                            type='email'
                            value={email}
                            required
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>First Name</label>
                        <input
                            className="form-control mt-1"
                            placeholder="Enter First Name"
                            name='firstName'
                            type='text'
                            value={firstName}
                            required
                            onChange={e => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Last Name</label>
                        <input
                            className="form-control mt-1"
                            placeholder="Enter Last Name"
                            name='lastName'
                            type='text'
                            value={lastName}
                            required
                            onChange={e => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            name='password'
                            type="password"
                            className="form-control mt-1"
                            placeholder="Enter Password"
                            value={password}
                            required
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Register
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
