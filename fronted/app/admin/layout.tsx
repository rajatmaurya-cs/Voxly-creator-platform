import React, { ReactNode } from "react";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/sidebar";

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen ">
    
      {/* <div className="fixed top-0 left-0 right-0 h-16 z-50">
        <Navbar />
      </div> */}

  
      <div className="fixed  left-0 w-64 h-[calc(100vh-4rem)] z-40">
        <Sidebar />
      </div>

    
      <main className=" ml-64 p-6 border-4 min-h-screen bg-black">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;