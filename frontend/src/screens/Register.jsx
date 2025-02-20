import React ,{useState,useContext} from 'react'
import axios from '../config/axios';
import { Link,useNavigate } from 'react-router-dom'
import { userContext } from '../context/user.context';
const Register = () => {

    const [email,setEmail] =useState('');
    const [password,setPassword] =useState('');
    const {setUser} = useContext(userContext);
    const navigate = useNavigate();
    function submitHandler(e){
        e.preventDefault();
        axios.post('/users/register',{
            email,
            password
        }).then((res)=>{
            console.log(res.data);
            localStorage.setItem('token',res.data.token);
            setUser(res.data.user);
            navigate('/')
        }).catch((err)=>{
            console.log(err.response.data)
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="bg-gray-800/90 p-8 rounded-xl shadow-2xl w-full max-w-md backdrop-blur-lg border border-gray-700">
            <h2 className="text-3xl font-extrabold text-white mb-6 text-center">Register</h2>
            <form
            onSubmit={submitHandler}
            >
              <div className="mb-4">
                <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
                <input
                onChange={(e)=>{setEmail(e.target.value)}}
                  type="email"
                  id="email"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-sm"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2" htmlFor="password">Password</label>
                <input
                onChange={(e)=>{setPassword(e.target.value)}}
                  type="password"
                  id="password"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-sm"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full p-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              >
                Register
              </button>
            </form>
            <p className="text-gray-400 mt-4 text-center">
              Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 transition">Login</Link>
            </p>
          </div>
        </div>
      );    
}

export default Register