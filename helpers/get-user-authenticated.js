export const getUserAuth = async () => {
    const response = await fetch('http://localhost:3000/api/user/userAuthenticated');
    const data = await response.json();
    return data.authenticatedUser;
};