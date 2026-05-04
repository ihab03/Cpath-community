// Assuming your axios instance is centralized somewhere like src/lib/axios
import { axiosInstance } from '../../../lib/axios'; 
// Reusing the Post type from your communities feature
import type { Post } from '../../communities/types/community'; 

export const getHomePosts = async (userId: string): Promise<Post[]> => {
  const response = await axiosInstance.get(`/Posts/home/${userId}`);
  return response.data;
};