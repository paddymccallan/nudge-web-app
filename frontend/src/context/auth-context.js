import React from 'react';

export default React.createContext({
    token: null,
    userId: null,
    username: null,
    login: (userId, username, token) => {},//add user id & username
    logout: () => {}
});