import axios from 'axios';
import { toast } from 'react-toastify';

// config axios w/ authorization
let consoleUser;
const tokenStr = localStorage.getItem('user');
if (tokenStr) {
    const token = JSON.parse(tokenStr).token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    consoleUser = JSON.parse(tokenStr)._id;
}
axios.defaults.headers.post['content-type'] = 'application/json';

// commands

function updateComplianceCardPrefs(complianceCardPrefs) {
    const API_URL = `${process.env.REACT_APP_BACKEND_SERVER}/complianceCardPrefs`;
    postCommand(API_URL, {consoleUser, complianceCardPrefs}, 'Dashboard cards have been saved.');
    console.log(complianceCardPrefs);
}



// post command to server
async function postCommand(url, data, message) {
    const response = await axios.post(url, data);
    if (response.status === 200) {
        toast.success(message);
    } else if (response.status === 401) {
        toast.error('Unauthorized');
    } else if (response.status === 404) {
        toast.error('Not found');
    } else {
        toast.error('Unknown server error');
    }
}

export { 
    updateComplianceCardPrefs
};

