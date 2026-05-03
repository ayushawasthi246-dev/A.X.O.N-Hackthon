import { useGoogleLogin, hasGrantedAllScopesGoogle } from '@react-oauth/google'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { userInfo } from '../store/authstore.jsx'

export default function SignUpPage() {

    const navigate = useNavigate()
    const { LeaderGoogleLoginAPI } = userInfo()
    const handleSuccess = async (authResult) => {
        try {
            const res = await LeaderGoogleLoginAPI(authResult)
            if(res.success) navigate("/create-project")
        } catch (error) {
            console.log(error)
        }
    }
    const handleError = (err) => {
        console.log("ERROR : ", err)
    }
    const googleLogin = useGoogleLogin({
        onSuccess: handleSuccess,
        onError: handleError,
        flow: 'auth-code',
        scope: 'openid email profile https://www.googleapis.com/auth/calendar',
        // prompt: 'select_account'
    })

    return (
        <div className="flex h-fit w-full justify-center items-center">
            <button
                onClick={googleLogin}
                className="btn flex gap-5 text-xl py-2 px-5 rounded-2xl cursor-pointer justify-center items-center bg-white text-black border-[#e5e5e5]">
                <svg aria-label="Google logo" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                Login with Google
            </button>
        </div>
    )
}