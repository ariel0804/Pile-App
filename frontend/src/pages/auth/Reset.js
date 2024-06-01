import React, { useState } from 'react'
import styles from "./auth.module.scss";

import { Link, useParams } from 'react-router-dom';
import { MdPassword } from "react-icons/md"
import { toast } from 'react-toastify';
import { resetPassword } from '../../services/authService';
import Card from '../../components/card/Card';

const initialState ={
  password:"",
  password2:""
};
const Reset = () => {

    const [formData,setFormData] = useState(initialState);
    const {password,password2} = formData;
    const {resetToken} = useParams();

    const handleInputChange = (e) =>{
      const {name,value}= e.target;
      setFormData({...formData,[name]:value})
  }
    const reset = async (e) =>{
      e.preventDefault();
    
      console.log(formData)

      const userData ={
        password,
        password2
      }
      
      try {
        const data = await resetPassword(userData,resetToken)
        toast.success(data.message)
        console.log(data)
      } catch (error) {
        console.log(error.message)
      }
      
    }
  
  return <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}> 
        <div className="--flex-center">
         <MdPassword size = {35} color="#999"/> 
        </div>

        <h2>Reset Password</h2>

  <form onSubmit={reset}>
    
    
    <input 
      type="password" 
      placeholder='New Password' 
      required name="password"
      value ={password} 
      onChange={handleInputChange}/>
    <input 
      type="password" 
      placeholder='Confirm New Password' 
      required name="password2"
      value={password2} 
      onChange={handleInputChange}/>
    
    <button type='submit' className='--btn --btn-primary --btn-block'> Okay </button>
    
  </form>
  

  <span className={styles.register}>
    <Link to="/">Home</Link>
    <p>
      &nbsp; Have an account? &nbsp;
    </p>
    <Link to="/login">Login</Link>
  </span>
  


        </div>

      </Card>
      
      </div>
}

export default Reset;