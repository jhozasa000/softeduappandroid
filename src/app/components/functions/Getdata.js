import axios from 'axios';
const url = process.env.REACT_APP_BACKEND

const Getdata = async (urlback) => {
    try {
      const response = await axios.get(url+urlback);
      return response
    } catch (error) {
      console.error(error);
      return error
    }
  }

export  {Getdata};