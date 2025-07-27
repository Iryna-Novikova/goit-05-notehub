import axios from "axios";
import type { NewNote, Note } from "../types/note";
    
interface NotesHttpResponse {
    notes: Note[];
    totalPages: number;
}

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';

// отримати список нотаток
export const fetchNotes = async (query: string, page: number): Promise<NotesHttpResponse> => {
    const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;
    const endPoint = '/notes';

    const params = {
        search: query.trim() ? query.trim() : ' ',
        page,
        perPage: 12,
    }

    const response = await axios.get<NotesHttpResponse>(endPoint, { params, headers: { Authorization: `Bearer ${myKey}` } });
    
    return response.data;
}

export const createNote = async(note: NewNote) => {
    const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;
    const endPoint = '/notes';

    const response = await axios.post<Note>(endPoint, note, { headers: { Authorization: `Bearer ${myKey}` } });
    
    return response.data;
}

export const deleteNote = async(id: number) => {
    const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;
    const endPoint = `/notes/${id}`;

    const response = await axios.delete<Note>(endPoint, { headers: { Authorization: `Bearer ${myKey}` } });

    return response.data;
}
