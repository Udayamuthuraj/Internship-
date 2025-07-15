// src/hooks/useAxios.js
import axios from "axios";

const useAxios = () => {
  const instance = axios.create({
    baseURL: "http://localhost:8080", // Change this to your backend URL
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return instance;
};

export default useAxios;
