
export default function isAdministrator() {
    let consoleUserRights;
    const tokenStr = localStorage.getItem('user');
    if (tokenStr) {
        consoleUserRights = JSON.parse(tokenStr).userType;
        if (consoleUserRights === 'consoleAdministrator') {
            return true;
        }
    } 
    return false;
}