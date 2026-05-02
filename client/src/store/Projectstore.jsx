import { create } from 'zustand'
import axios from 'axios'
import { userInfo } from './authstore.jsx'

const serverURL = import.meta.env.VITE_BACKEND_URL
const token = userInfo.getState().accessToken

export const ProjectStore = create((set, get) => ({
    ProjectCreate: async (Data) => {
        console.log("DATA : ", Data)
        try {
            const result = await axios.post(serverURL + '/Project/Create-Project', { Data }, {
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

    ProjectUpdate: async (Data , id) => {
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

    ProjectList: async (Data) => {
        try {
            const result = await axios.get(serverURL + '/Project/Project-List',{
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

    UserList: async () => {
    try {
        const token = userInfo.getState().accessToken

        const res = await axios.get(serverURL + "/auth/MembersList", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, message: err }
    }
}
})
)