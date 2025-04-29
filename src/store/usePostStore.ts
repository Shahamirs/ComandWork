import { create  } from 'zustand';
import axiosApi from '../axiosApi.ts';

interface Post {
    id: number;
    title?: string;
    content?: string;
    extraInfo?: string;
    categoryId?: number;
    createdAt?: string;

}

interface PostState {
    posts: Post[];
    getAllPosts: () => Promise<void>;
}

export const usePostsStore =  create<PostState>((set) => ({
    posts: [],
    error: null,

    getAllPosts: async () => {
        try {
            const response = await axiosApi.get<Post[]>('/posts');
            set({posts: response.data});
        } catch (error) {
            console.log(error);
        }
    }
}))
