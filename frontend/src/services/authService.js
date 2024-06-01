import axios from "axios";
import {toast} from "react-toastify";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const validateEmail = (email) =>{
    return email.match(/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/)
};

//Register User
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/users/register`,userData,{withCredentials:true})
        if (response.statusText === "OK"){
            toast.success("User Registered Successfully")
        }
        return response.data
    } catch (error) {
        const message = (
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();

        toast.error(message)
    }
};
//Login User
export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/users/login`,userData,{withCredentials:true})
        if (response.statusText === "OK"){
            toast.success("Login Successful")
        }
        return response.data
    } catch (error) {
        const message = (
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();

        toast.error(message)
    }
};

//Logout user

export const logoutUser = async () => {
    try {
        await axios.get(`${BACKEND_URL}/api/users/logout`)
    
    } catch (error) {
        const message = (
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();

        toast.error(message)
    }
};

//Forgot Password

export const forgotPassword = async (userData) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/users/forgotpassword`,userData)
        toast.success(response.data.message)
    } catch (error) {
        const message = (
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();

        toast.error(message)
    }
};

//Reset Password

export const resetPassword = async (userData,resetToken) => {
    try {
        const response = await axios.put(`${BACKEND_URL}/api/users/resetpassword/${resetToken}`,userData)
        console.log(response)
        return response.data
        
    } catch (error) {
        const message = (
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();

        toast.error(message)
    }
};
//Get Login Status
export const getLoginStatus = async () => {
    try {
        const response = await axios.get(`${BACKEND_URL}/api/users/loggedin`)
        return response.data
        
    } catch (error) {
        const message = (
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();

        toast.error(message)
    }
};

//Get User profile

export const getUserProfile = async () => {
    try {
        const response = await axios.get(`${BACKEND_URL}/api/users/getuser`)
        return response.data
        
    } catch (error) {
        const message = (
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();

        toast.error(message)
    }
};

// update user profile

export const updateUser = async (formData) => {
    try {
        const response = await axios.patch(`${BACKEND_URL}/api/users/updateuser`, formData)
        return response.data

    } catch (error) {
        const message = (
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();

        toast.error(message)
    }
}
//change password
export const changePassword = async (formData) => {
    try {
        const response = await axios.patch(`${BACKEND_URL}/api/users/changepassword`, formData)
        return response.data

    } catch (error) {
        const message = (
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();

        toast.error(message)
    }
}