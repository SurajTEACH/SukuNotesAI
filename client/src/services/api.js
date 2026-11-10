import axios from "axios"
import { serverUrl } from "../App"
import { setUserData } from "../redux/userSlice.js";

export const getCurrentUser = async (dispatch) => {
    try {
       const token = localStorage.getItem("token");
       const result = await axios.get(serverUrl + "/api/user/currentuser", {
           headers: token ? { Authorization: `Bearer ${token}` } : {},
           withCredentials: true
       });
      
       dispatch(setUserData(result.data));

    } catch (error) {
        console.log(error);
    }
}

export const logoutUser = async () => {
  try {
    await axios.get(`${serverUrl}/api/auth/logout`, {
      withCredentials: true,
    });
  } catch (error) {
    console.log(error);
  }
  localStorage.removeItem("token");
};


export const  generateNotes = async (payload) =>{
    try {
      const token = localStorage.getItem("token");
      const result = await axios.post(serverUrl + "/api/notes/generate-notes", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true
      });
      return result.data

    } catch (error) {
        console.log(error);
    }
}

export const downloadNotesPdf = async (result) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(serverUrl + "/api/notes-download/generate-notes-pdf", {result}, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            responseType: 'blob',
            withCredentials: true
        });

        const blob = new Blob([response.data], {
           type:"application/pdf"
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "ExamNotes.pdf";
        link.click();

        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to download PDF");
        
    }
}