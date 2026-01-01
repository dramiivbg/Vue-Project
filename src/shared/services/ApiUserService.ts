import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { User } from '../models/User';
import { Login } from '../models/Login';

class ApiUserService {

    private apiClient: AxiosInstance;

    constructor(){
        this.apiClient = axios.create({
      baseURL: "http://localhost:5199/api/User",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    }
    
    GetById = async (id:number): Promise<User> => {
        const token = localStorage.getItem('user_token');
        const config = {
            headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
            }
         }
    
        try {
            const response = await this.apiClient.get(`/GetById/${id}`, config);
            //console.log(response)
            if (!response.data.esCorrecto) throw new Error(response.data.mensaje);
            return response.data.resultado;
        } catch (error) {
            throw error;
        }
    
    }
    
    List = async (search:string):Promise<User[]> => {
    
        const token = localStorage.getItem('user_token');
        const config = {
            headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
            }
         }
    
        try {
            const response = await this.apiClient.get(`/List/${search}`, config);
            if (!response.data.esCorrecto) throw new Error(response.data.mensaje);
            return response.data.resultado;
        } catch (error) {
            throw error;
        }
    
    }
    
    Create = async (payload:User):Promise<User> => {
    
        const token = localStorage.getItem('user_token');
        const config = token ? {
            headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
            }
         } : {};
    
        try {
            const response = await this.apiClient.post(`/Create`, payload, config);
            if (!response.data.esCorrecto) throw new Error(response.data.mensaje);
            return response.data.resultado;
        } catch (error) {
            throw error;
        }
    
    }
    
    Edit = async (payload:User): Promise<User> => {
    
        const token = localStorage.getItem('user_token');
        const config = {
            headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
            }
         }
    
        try {
            const response = await this.apiClient.put(`/Edit`, payload, config);
            if (!response.data.esCorrecto) throw new Error(response.data.mensaje);
            return response.data.resultado;
        } catch (error) {
            throw error;
        }
        
    }
    
    Delete =  async (id:number): Promise<boolean> => {
    
        const token = localStorage.getItem('user_token');
        const config = {
            headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
            }
         }
    
        try {
            const response = await this.apiClient.delete(`/Delete/${id}`, config);
            if (!response.data.esCorrecto) throw new Error(response.data.mensaje);
            return response.data.resultado;
        } catch (error) {
            throw error;
        }
    
    }

    Deactivate =  async (id:number): Promise<boolean> => {
    
        const token = localStorage.getItem('user_token');
        const config = {
            headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
            }
         }
    
        try {
            const response = await this.apiClient.get(`/Deactivate/${id}`, config);
            if (!response.data.esCorrecto) throw new Error(response.data.mensaje);
            return response.data.resultado;
        } catch (error) {
            throw error;
        }
    
    }

    
    Activate =  async (id:number): Promise<boolean> => {
    
        const token = localStorage.getItem('user_token');
        const config = {
            headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
            }
         }
    
        try {
            const response = await this.apiClient.get(`/Activate/${id}`, config);
            if (!response.data.esCorrecto) throw new Error(response.data.mensaje);
            return response.data.resultado;
        } catch (error) {
            throw error;
        }
    
    }
    
    Login = async (payload:Login):Promise<User> => {
    
        try {
            const response = await this.apiClient.post(`/Login`, payload);
            if (!response.data.esCorrecto) throw new Error(response.data.mensaje);
            return response.data.resultado;
        } catch (error) {
            throw error;
        }
    
    }
}

export default new ApiUserService();