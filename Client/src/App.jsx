
import React, { Suspense, lazy, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "./Context/Authcontext";
const Home = lazy(() => import("./Components/Homefolder/Home"));
const WholeBlog = lazy(() => import("./WholeBlog"));
const Login = lazy(() => import("./Components/Homefolder/Login"));
const Signup = lazy(() => import("./Components/Homefolder/Signup"));
const ForgetPassword = lazy(() => import("./Components/PasswordReset/ForgetPassword"));

const Layout = lazy(() => import("./Components/AdminFolder/Layout"));
const DashBoard = lazy(() => import("./Components/AdminFolder/DashBoard"));
const BlogList = lazy(() => import("./Components/AdminFolder/BlogList"));
const Comments = lazy(() => import("./Components/AdminFolder/Comments"));
const AddBlog = lazy(() => import("./Components/AdminFolder/AddBlog"));
const AI = lazy(() => import("./Components/AdminFolder/AI"));
const AIconfig = lazy(() => import("./Components/AdminFolder/AISettings"));

const PrivacyPolicy = lazy(() => import("./Pages/PrivacyPolicy.jsx"))
const Terms = lazy(() => import("./Pages/Terms.jsx"))

function HomeSkeleton() {
  return (
    <div className="min-h-screen w-full bg-white">
      
      {/* Navbar */}
      <div className="border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          <div className="h-8 w-32 rounded-md bg-gray-200 animate-shimmer" />
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-28 rounded-full bg-gray-200 animate-shimmer" />
            <div className="h-10 w-32 rounded-full bg-gray-200 animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center">
        
        <div className="mb-8 h-10 w-56 rounded-full bg-gray-200 animate-shimmer" />
        
        <div className="mb-4 h-14 w-full max-w-2xl rounded-lg bg-gray-200 animate-shimmer" />
        <div className="mb-6 h-14 w-3/4 rounded-lg bg-gray-200 animate-shimmer" />
        
        <div className="h-5 w-80 rounded bg-gray-200 animate-shimmer" />
      </div>

      {/* Search + Tags */}
      <div className="mx-auto max-w-5xl px-6 pb-16">
        
        <div className="mx-auto mb-8 h-14 w-full max-w-2xl rounded-full bg-gray-200 animate-shimmer" />
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 rounded-full bg-gray-200 animate-shimmer"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Blog Cards */}
      <div className="mx-auto max-w-6xl px-6 pb-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            
            {/* Image */}
            <div
              className="h-48 w-full rounded-xl bg-gray-200 animate-shimmer"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
            
            {/* Title */}
            <div className="h-6 w-3/4 rounded bg-gray-200 animate-shimmer" />
            
            {/* Description */}
            <div className="h-4 w-full rounded bg-gray-200 animate-shimmer" />
            <div className="h-4 w-5/6 rounded bg-gray-200 animate-shimmer" />
            
            {/* Author */}
            <div className="flex items-center gap-3 mt-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-shimmer" />
              <div className="h-4 w-24 rounded bg-gray-200 animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function App() {

  const { loading } = useContext(AuthContext);

  if (loading) return <HomeSkeleton />;

  return (

    <Suspense fallback={<HomeSkeleton/>}>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/blog/:blogId" element={<WholeBlog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />

        <Route path="/admin" element={<Layout />}>
          <Route index element={<DashBoard />} />
          <Route path="listBlog" element={<BlogList />} />
          <Route path="AI" element={<AI />} />
          <Route path="AIsetting" element={<AIconfig />} />
          <Route path="Comments" element={<Comments />} />
          <Route path="addblog" element={<AddBlog />} />
        </Route>
        
      </Routes>

    </Suspense>
  );
}

export default App;
