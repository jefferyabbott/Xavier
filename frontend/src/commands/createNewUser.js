import axios from 'axios';
import { toast } from 'react-toastify';

// config axios w/ authorization
const tokenStr = localStorage.getItem('user');
if (tokenStr) {
    const token = JSON.parse(tokenStr).token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.headers.post['content-type'] = 'application/json';
}


// commands

function createNewUser(name, email, password, userType) {
    const API_URL = `${process.env.REACT_APP_BACKEND_SERVER}/api/users/createNewUser`;
    const options = {
        name,
        email,
        password,
        userType
    }
    const message = `New user account for ${name} has been created.`;
    const addSuccessful = postCommandWithOptions(API_URL, options, message);

    const addedUser = { name, email, userType };
    return addedUser;
}

// post command to server w/ options
async function postCommandWithOptions(url, data) {
    const response = await axios.post(url, data);
    if (response.status === 201) {
        toast.success(response.data.message);
        return true;
    } else if (response.status === 401) {
        toast.error('Unauthorized');

    } else {
        toast.error('Unknown server error');
    }
    return false;
}

export { 
    createNewUser
};
