import axios from 'axios';

const url = "http://localhost:5199/api";

export const GetById = async (controller, id) => {
    const token = localStorage.getItem('user_token');
    const config = {
        headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
        }
     }

    try {
        const response = await axios.get(`${url}/${controller}/GetById/${id}`, config);
        //console.log(response)
        if (!response.data.esCorrecto) throw new Error(response.data.mensaje);
        return response.data.resultado;
    } catch (error) {
        throw error;
    }

}

export const List = async (controller, search) => {

    const token = localStorage.getItem('user_token');
    const config = {
        headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
        }
     }

    try {
        const response = await axios.get(`${url}/${controller}/List/${search}`, config);
        if (!response.data.esCorrecto) throw new Error(response.data.mensaje);
        return response.data.resultado;
    } catch (error) {
        throw error;
    }

}

export const Create = async (controller, payload) => {

    const token = localStorage.getItem('user_token');
    const config = token ? {
        headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
        }
     } : {};

    try {
        const response = await axios.post(`${url}/${controller}/Create`, payload, config);
        if (!response.data.esCorrecto) throw new Error(response.data.mensaje);
        return response.data.resultado;
    } catch (error) {
        throw error;
    }

}

export const Edit = async (controller, payload) => {

    const token = localStorage.getItem('user_token');
    const config = {
        headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
        }
     }

    try {
        const response = await axios.put(`${url}/${controller}/Edit`, payload, config);
        if (!response.data.esCorrecto) throw new Error(response.data.mensaje);
    } catch (error) {
        throw error;
    }
    
}

export const Delete =  async (controller, id) => {

    const token = localStorage.getItem('user_token');
    const config = {
        headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
        }
     }

    try {
        const response = await axios.delete(`${url}/${controller}/Delete/${id}`, config);
        if (!response.data.esCorrecto) throw new Error(response.data.mensaje);
    } catch (error) {
        throw error;
    }

}

export const Login = async (payload) => {

    try {
        const response = await axios.post(`${url}/User/Login`, payload);
        if (!response.data.esCorrecto) throw new Error(response.data.mensaje);
        return response.data.resultado;
    } catch (error) {
        throw error;
    }

}