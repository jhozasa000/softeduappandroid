import axios from 'axios';
const url = process.env.REACT_APP_BACKEND

const Putdata = async (urlback,datos) => {
  try {
      const response = await axios.put(url+urlback,datos);
      return response
    } catch (error) {
      console.error(error);
      return error
    }
  }

export  {Putdata};