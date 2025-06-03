// client/src/utils/auth.js

const isTokenExpired = () => {
    const token = localStorage.getItem("token");
    if (!token) return true;

    try {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        return Date.now() >= exp * 1000;
    } catch {
        return true;
    }
};

export default isTokenExpired;
