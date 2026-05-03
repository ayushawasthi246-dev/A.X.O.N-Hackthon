import { useGoogleLogin } from '@react-oauth/google'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userInfo } from '../store/authstore.jsx'

export default function MemberSignup() {

    const navigate = useNavigate()
    const { MemberGoogleLoginAPI } = userInfo()

    // ✅ state for github link
    const [githubLink, setGithubLink] = useState("")

    const handleSuccess = async (authResult) => {
        try {
            const res = await MemberGoogleLoginAPI(authResult, githubLink)
            if (res.success) navigate("/hello")
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
    })

    return (
        <div className="flex flex-col justify-center items-center gap-6 ">

            <div className="w-full">
                <label className="text-xs text-gray-400 uppercase">
                    GitHub Repository
                </label>
                <input
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    className="w-full mt-2 bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
                    placeholder="https://github.com/username/repo"
                />
            </div>

            <button
                onClick={googleLogin}
                className="btn bg-white w-full text-black border-[#e5e5e5] flex items-center gap-2 px-4 py-2 rounded-lg"
            >
                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <g>
                        <path d="m0 0H512V512H0" fill="#fff"></path>
                        <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                        <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                        <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                        <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
                    </g>
                </svg>
                Login with Google
            </button>

        </div>
    )
}