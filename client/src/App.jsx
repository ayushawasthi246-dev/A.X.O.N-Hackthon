import { Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import CreateProject from "./pages/CreateProject.jsx"
import LandingPage from "./pages/LandingPage.jsx"
import ProjectList from "./pages/ProjectList.jsx"
import { GoogleOAuthProvider } from '@react-oauth/google'
function App() {

  const GoogleLoginWrapper = () => {
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
        <LandingPage></LandingPage>
      </GoogleOAuthProvider>
    )
  }


  return (
    <>
      <Routes>
        <Route path="/" element={<GoogleLoginWrapper/>}/>
        <Route path="/projects" element={<GoogleLoginWrapper/>}/>
        <Route path="/create-project" element={<CreateProject/>}/>
        <Route path="/ProjectList" element={<ProjectList/>}/>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
