import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { Payment } from '../models/Payment';
import { UserTop } from '../models/UserTop';


class ApiDashboardService {

    private apiClient: AxiosInstance;

    constructor(){
        const token = localStorage.getItem('user_token');
        this.apiClient = axios.create({
        baseURL: "http://localhost:5199/api/Dashboard",
            headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
            },
    });
    }

    
    TopUsers = async ():Promise<UserTop[]> => {
        try {
            const response = await this.apiClient.get<UserTop[]>(`/top-users`);
            return response.data;
        } catch (error) {
            throw error;
        }
    
    }

    TotalOders = async ():Promise<number> => {
    
        try {
            const response = await this.apiClient.get<number>(`/total-orders`);
            return response.data;
        } catch (error) {
            throw error;
        }
    
    }

    TotalUsers = async ():Promise<number> => {
    
        try {
            const response = await this.apiClient.get<number>(`/total-users`);
            return response.data;
        } catch (error) {
            throw error;
        }
    
    }

}

export default new ApiDashboardService();