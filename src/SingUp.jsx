import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import {useNavigate} from 'react-router-dom';
const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        username: ''
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const {signUpNewUser} = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Handle sign-up logic here, e.g., call an API to create a new user
        const result  = await signUpNewUser(formData)
        if(result.success){
            console.log("User signed up successfully: ", result.data);
            navigate('/dashboard')
        }
        else
        {
            setError(result.error.message);
            // navigate('/signup')
        }
        console.log("Form Data Submitted: ", formData);
        setLoading(false);
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }
    return (
        <div>
            {loading ? <p>Loading...</p> : <><form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required onChange={handleChange} />
                </div>
                <button type="submit">Sign Up</button>
            </form><p>Already have an account? <Link to="/signin">Log In</Link></p>
            {error && <p style={{color:'red'}}>Error: {error}</p>}
            </>}
        </div>
    )
};
export default Signup;
