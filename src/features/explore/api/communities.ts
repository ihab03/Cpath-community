import { axiosInstance } from '../../../lib/axios';
import type { Community } from '../types/explore';



export const getCommunities = async (): Promise<Community[]> => {
  const response = await axiosInstance.get('/Communities');
  return response.data;
};