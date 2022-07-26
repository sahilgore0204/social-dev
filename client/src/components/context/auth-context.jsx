import React from 'react';

let AuthContext=React.createContext({
    jwt:'',
    setJwt:''
});
export default AuthContext;