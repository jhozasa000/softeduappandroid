import axios from 'axios';
const url = process.env.REACT_APP_BACKEND

const Postdata = async (urlback,datos) => {
    try {
      const response = await axios.post(url+urlback,datos);
      return response
    } catch (error) {
      console.error(error);
      return error
    }
  }

export  {Postdata};