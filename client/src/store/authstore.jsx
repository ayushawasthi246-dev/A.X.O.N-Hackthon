import { create } from 'zustand'
import axios from 'axios'

const serverURL = import.meta.env.VITE_BACKEND_URL

export const userInfo = create((set, get) => ({
    UserData: {},
    accessToken: "",

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

    MemberGoogleLoginAPI: async (authResult, Account) => {
        try {
            const result = await axios.post(serverURL + '/auth/MemberRegister', { code: authResult.code, AccountLink: Account }, { withCredentials: true })

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

    checkLeaderAuth: async () => {
        console.log("HEYYEYEYE")
        let token = get().accessToken
        try {
            if (!token) {
                console.log("HEYYE2132YEYE")
                const res = await axios.get(serverURL + "/auth/GenerateAccessToken", { withCredentials: true })
                if (res.data?.success) {
                    console.log("HEYYEY2123132132132132EYE")
                    token = res.data.accessToken
                    set({ accessToken: res.data.accessToken })
                    console.log("ACC :",res.data.accessToken)
                } else {
                    return { success: res.data?.success, message: res.data?.message }
                }

                console.log("RES111 : ", res)
            }
            const res = await axios.get(serverURL + "/auth/checkLeaderAuth", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("RESddddd :", res)
            if (res.data?.success) {
                console.log("TOOOOOOOOO")
                console.log("DTATAT : ", res.data.UserData)
                set({ UserData: res.data.UserData })
                return { success: res.data?.success, message: res.data?.message }
            } else {
                console.log("HELLLLLLLLLLO")
                return { success: res.data?.success, message: res.data?.message }
            }
        } catch (err) {
            console.log("ERRRRRRR : ",err)
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

    checkMemberAuth: async () => {
        console.log("HEYYEYEYE")
        let token = get().accessToken
        try {
            if (!token) {
                console.log("HEYYE2132YEYE")
                const res = await axios.get(serverURL + "/auth/GenerateAccessToken", { withCredentials: true })
                if (res.data?.success) {
                    console.log("HEYYEY2123132132132132EYE")
                    token = res.data.accessToken
                    set({ accessToken: res.data.accessToken })
                    console.log("ACC :",res.data.accessToken)
                } else {
                    return { success: res.data?.success, message: res.data?.message }
                }
            }
            const res = await axios.get(serverURL + "/auth/checkMemberAuth", {
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

    UserList: async () => {
        try {
            console.log("121")
            const token = userInfo.getState().accessToken

            console.log("122")

            const res = await axios.get(serverURL + "/auth/MembersList")

            console.log("123")

            console.log("RESSSS DATATATAAT : ", res.data)

            return { success: true, data: res.data }
        } catch (err) {
            console.log("121212121212 : ",err)
            return { success: false, message: err }
        }
    }
})
)