import React , {useState} from 'react';
import './Login.scss'; 
import {useNavigate} from 'react-router'
//https://th.bing.com/th/id/R.676c53bb087fae58ca7e5d5e57276f6e?rik=RGIvJAb62Mk16w&pid=ImgRaw&r=0
const Login = () => {
  const [username,setUser] = useState<any>('')
  const nav = useNavigate()
  const submit = ()=>{
    if(username == ''){
      alert('Username can not be empty')
    }else{
      window.sessionStorage.setItem('username',username)
      nav('/home')
    }
  }
  return (
    <div className="login-container">
      <div className="image-container">
        <img src="https://th.bing.com/th/id/R.676c53bb087fae58ca7e5d5e57276f6e?rik=RGIvJAb62Mk16w&pid=ImgRaw&r=0" alt="Login" />
      </div>
      <div className="form-container">
        <h2>Welcome Back</h2>
        <form>
          <div className="input-container">
            <label htmlFor="username">Username:</label>
            <input value={username} onInput={(e:any)=>{setUser(e.target.value)}} type="text" id="username" name="username" placeholder="Enter your username or email  " />
          </div>
          {/* <div className="input-container">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" />
          </div> */}
          <div className="button-container">
            <button type="button" onClick={submit} className="login-button">Login</button>
          </div>
          {/* <div className="button-container">
            <button type="button" className="register-button">Register</button>
          </div> */}
        </form>
      </div>
    </div>
  );
}
 
export default Login;

