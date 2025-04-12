
import { Link } from "react-router-dom";
import { Building } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-rental-primary text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <Building className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">RentalSystem</span>
            </div>
            <p className="max-w-xs text-blue-100">
              Simplifying property management and enhancing residential community living.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-blue-100 hover:text-white transition">Home</Link></li>
                <li><Link to="/tenant/login" className="text-blue-100 hover:text-white transition">Tenant Login</Link></li>
                <li><Link to="/admin/login" className="text-blue-100 hover:text-white transition">Admin Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Features</h3>
              <ul className="space-y-2">
                <li><span className="text-blue-100">Property Listings</span></li>
                <li><span className="text-blue-100">Maintenance Requests</span></li>
                <li><span className="text-blue-100">Society Notices</span></li>
                <li><span className="text-blue-100">Document Management</span></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><span className="text-blue-100 hover:text-white transition">Privacy Policy</span></li>
                <li><span className="text-blue-100 hover:text-white transition">Terms of Service</span></li>
                <li><span className="text-blue-100 hover:text-white transition">Cookie Policy</span></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-12 pt-6 text-blue-100 text-sm">
          <p>&copy; {new Date().getFullYear()} Rental and Property Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
