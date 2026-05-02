import { Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import CreateProject from "./pages/CreateProject.jsx"
import LandingPage from "./pages/LandingPage.jsx"
import SignUpPage from "./pages/Signup.jsx"
import MemberSingup from "./pages/MemberSignup.jsx"
import { GoogleOAuthProvider } from '@react-oauth/google'
function App() {

  const GoogleLoginWrapperAsLeader = () => {
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
        <SignUpPage></SignUpPage>
      </GoogleOAuthProvider>
    )
  }

  const GoogleLoginWrapperAsMember = () => {
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
        <MemberSingup></MemberSingup>
      </GoogleOAuthProvider>
    )
  }


  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/projects" element={<CreateProject/>}/>
        <Route path="/singup" element={<GoogleLoginWrapperAsLeader/>}/>
        <Route path="/MemberSingup" element={<GoogleLoginWrapperAsMember/>}/>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
