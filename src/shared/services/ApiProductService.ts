import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { Product } from '../models/Product';


class ApiProductService {

    private apiClient: AxiosInstance;

    constructor(){
        this.apiClient = axios.create({
      baseURL: "http://localhost:5199/api/Product",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    }
    
    GetById = async (id:number): Promise<Product> => {
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
    
    List = async (search:string):Promise<Product[]> => {
    
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
    
    Create = async (payload:Product):Promise<Product> => {
    
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
    
    Edit = async (payload:Product): Promise<Product> => {
    
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
}

export default new ApiProductService();