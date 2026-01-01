import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { Payment } from '../models/Payment';


class ApiPaymentService {

    private apiClient: AxiosInstance;

    constructor(){
        this.apiClient = axios.create({
      baseURL: "http://localhost:5199/api/Payment",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    }

    
    Create = async (payload:Payment):Promise<Payment> => {
    
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

}

export default new ApiPaymentService();