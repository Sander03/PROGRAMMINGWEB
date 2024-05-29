// eslint-disable-next-line no-unused-vars
let user;
export function getToken() {
    return getUser()?.token;
}

export function saveUser(userData) {
    return localStorage.setItem("userData", JSON.stringify(userData));
}

export function getUser() {
    console.log("user js");
    console.log(user);
    if (user === undefined || user === null){
        const getUserData =  localStorage.getItem("userData");
        console.log("getUserData");
        console.log(getUserData);
        user =  JSON.parse(getUserData);
    }
    return user;
}

export function logoutUser(){
    localStorage.removeItem("userData");
}