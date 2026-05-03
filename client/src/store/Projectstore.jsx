import { create } from 'zustand'
import axios from 'axios'
import { userInfo } from './authstore.jsx'

const serverURL = import.meta.env.VITE_BACKEND_URL

export const ProjectStore = create((set, get) => ({

    ProjectCreate: async (Data) => {
        const token = userInfo.getState().accessToken;
        console.log("DATA : ", Data)
        try {
            const result = await axios.post(serverURL + '/Project/Create-Project', { Data } , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log("REEEEEEEEE : ", result)

            return { success: true, message: result }
        } catch (error) {
            console.log("Errvfsvfdsbfdbdfor : ", error)
            return { success: false, message: error }
        }
    },

    ProjectUpdate: async (Data, id) => {
        try {
            const result = await axios.post(serverURL + `/Project/Update-Project/${id}`, { Data }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { success: true, message: result }
        } catch (error) {
            console.log("Error : ", error)
            return { success: false, message: error }
        }
    },

    projects: [],

    ProjectList: async () => {
        // GET TOKEN HERE
        const token = userInfo.getState().accessToken; 
        try {
            const result = await axios.get(serverURL + '/Project/Project-List', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update state so the UI re-renders
            set({ projects: result.data.ProjectList }); 
            return { success: true, message: result };
        } catch (error) {
            return { success: false, message: error };
        }
    },

    MemberProjectList: async () => {
        console.log("HELLO ACCESS : ", token)
        try {
            const result = await axios.get(serverURL + '/Project/Members-Project-List', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { success: true, message: result }
        } catch (error) {
            console.log("Error : ", error)
            return { success: false, message: error }
        }
    },

})
)