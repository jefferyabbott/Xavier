import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_SERVER}/api/users/`;

// register user
const register = async (userData) => {
    const response = await axios.post(API_URL, userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
}

// login user
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
}

// logout user 
const logout = () => {
    localStorage.removeItem('user');
}

const authService = {
    register,
    login,
    logout
}

export default authService;

