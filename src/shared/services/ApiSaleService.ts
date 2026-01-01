import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { Sale } from '../models/Sale';


class ApiSaleService {

    private apiClient: AxiosInstance;

    constructor(){
        this.apiClient = axios.create({
      baseURL: "http://localhost:5199/api/Sale",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    }
    
    
    List = async (search:string):Promise<Sale[]> => {
    
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
    
    Create = async (payload:Sale[]):Promise<Sale[]> => {
    
        const token = localStorage.getItem('user_token');
        const config = {
            headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
            }
         };
    
        try {
            const response = await this.apiClient.post(`/Paid`, payload, config);
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
            const response = await this.apiClient.delete(`/Cancel/${id}`, config);
            if (!response.data.esCorrecto) throw new Error(response.data.mensaje);
            return response.data.resultado;
        } catch (error) {
            throw error;
        }
    
    }
}

export default new ApiSaleService();