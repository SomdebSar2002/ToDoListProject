import {useState} from 'react';
import {useAuth} from './AuthProvider';
import { useNavigate } from 'react-router-dom';
export default function SignIn(){
    const {signIn} = useAuth();
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        email:'',
        password:''
    });
    const handleChange = (e)=>{
        const {name,value} = e.target;
        setFormData((prevData)=>({
            ...prevData,
            [name]:value
        }));
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const result = await signIn(formData);
        if(result.success){
            console.log("User signed in successfully: ", result.data);
            navigate('/dashboard')
            // navigate to dashboard
        }else{
            console.error("Wrong email or password: ", result.error);
            // show error message
        }
    }
    return(
        <div>
            <h1>Sign In Page</h1>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                <br/>
                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                <br/>
                <button type="submit">Sign In</button>
            </form>
        </div>
    )
}