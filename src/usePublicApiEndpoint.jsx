import axios from 'axios';
import React from 'react';

const apiEndpoint = axios.create({
    // baseURL:"http://localhost:5000/api",
    baseURL: "https://travelbd-server-vgxf.onrender.com/api",
    withCredentials: true,
})
const UsePublicApiEndpoint = () => {
 
    return apiEndpoint;
};

export default UsePublicApiEndpoint;