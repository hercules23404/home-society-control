
import React from "react";
import { Building } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  userType: "tenant" | "admin";
}

const AuthLayout = ({ children, title, subtitle, userType }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-rental-background flex flex-col">
      <div className="container mx-auto py-4 px-4">
        <Link to="/" className="flex items-center text-rental-primary hover:text-rental-secondary">
          <Building className="h-6 w-6 mr-2" />
          <span className="font-bold text-lg">RentalSystem</span>
        </Link>
      </div>
      
      <div className="flex-grow container mx-auto flex flex-col md:flex-row items-center justify-center px-4 py-8">
        {/* Left column with form */}
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold mb-2 text-rental-text">{title}</h1>
            <p className="text-rental-text-light">{subtitle}</p>
          </div>
          
          {children}
          
          <div className="mt-8 text-center text-sm text-rental-text-light">
            {userType === "tenant" ? (
              <>
                Are you an admin? <Link to="/admin/login" className="text-rental-primary font-medium hover:underline">Admin Login</Link>
              </>
            ) : (
              <>
                Are you a tenant? <Link to="/tenant/login" className="text-rental-primary font-medium hover:underline">Tenant Login</Link>
              </>
            )}
          </div>
        </div>
        
        {/* Right column with decoration */}
        <div className="hidden md:block w-full max-w-md">
          <div className="px-8">
            <div className="bg-gradient-to-br from-rental-primary to-rental-secondary rounded-lg p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">
                {userType === "tenant" 
                  ? "Welcome to Your Society Hub" 
                  : "Society Management Made Simple"}
              </h3>
              <p className="mb-4 text-blue-100">
                {userType === "tenant"
                  ? "Connect with your society, access notices, submit requests, and manage your documents in one place."
                  : "Powerful tools to manage your society, residents, and requests efficiently."}
              </p>
              <ul className="space-y-2">
                {userType === "tenant" ? (
                  <>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-blue-200 mr-2"></span>
                      <span>View society notices</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-blue-200 mr-2"></span>
                      <span>Submit maintenance requests</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-blue-200 mr-2"></span>
                      <span>Manage property listings</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-blue-200 mr-2"></span>
                      <span>Manage society members</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-blue-200 mr-2"></span>
                      <span>Handle service requests</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-blue-200 mr-2"></span>
                      <span>Post important notices</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
