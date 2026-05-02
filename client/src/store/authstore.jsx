import { create } from 'zustand'
import axios from 'axios'

const serverURL = import.meta.env.VITE_BACKEND_URL

export const userInfo = create((set, get) => ({
    UserData: {},
    accessToken : "",

    LeaderGoogleLoginAPI: async (authResult) => {
        try {
            const result = await axios.post(serverURL + '/auth/LeaderRegister', { code: authResult.code }, { withCredentials: true })

            const res = result.data.Response

            set({
                UserData: {
                    Username: res.Data.Username,
                    Email: res.Data.Email,
                    ProfilePic: res.Data.ProfilePic,
                },
                accessToken: res.accessToken
            })

            return { success: true, message: "You're registered" }
        } catch (error) {
            console.log("Error : ", error)
            return { success: false, message: error }
        }
    },

    MemberGoogleLoginAPI: async (authResult , Account) => {
        try {
            const result = await axios.post(serverURL + '/auth/MemberRegister', { code: authResult.code }, { withCredentials: true })

            const res = result.data.Response

            set({
                UserData: {
                    Username: res.Data.Username,
                    Email: res.Data.Email,
                    ProfilePic: res.Data.ProfilePic,
                },
                accessToken: res.accessToken
            })

            return { success: true, message: "You're registered" }
        } catch (error) {
            console.log("Error : ", error)
            return { success: false, message: error }
        }
    },

    checkAuth: async () => {
        let token = get().accessToken
        try {
            if (!token) {
                const res = await axios.get(serverURL + "/auth/GenerateAccessToken", { withCredentials: true })
                if (res.data?.success) {
                    token = res.data.accessToken
                    set({ accessToken: res.data.accessToken })
                } else {
                    return { success: res.data?.success, message: res.data?.message }
                }
            }
            const res = await axios.get(serverURL + "/auth/checkAuth", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.data?.success) {
                console.log("DTATAT : ", res.data.UserData)
                set({ UserData: res.data.UserData })
                return { success: res.data?.success, message: res.data?.message }
            } else {
                return { success: res.data?.success, message: res.data?.message }
            }
        } catch (err) {
            const status = err.response?.status;
            if (status === 401) {
                return { success: false }
            }
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
            return { success: false, message: errorMessage }
        } finally {
            set({ isAuthChecking: false })
        }
    },
})
)