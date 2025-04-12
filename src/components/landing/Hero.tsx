
import React from "react";
import { Building, Users, Wrench, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-b from-rental-primary to-rental-secondary text-white py-20 px-8 md:py-32">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Smart Society Management System
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Simplify community living with our comprehensive property and society management platform. Connect residents, manage properties, and streamline society operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-rental-primary hover:bg-blue-100"
              >
                <Link to="/tenant/login">Tenant Login</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link to="/admin/login">Admin Login</Link>
              </Button>
            </div>
          </div>
          <div className="hidden lg:flex justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute w-72 h-72 bg-blue-400 rounded-full opacity-30 -top-10 -left-10"></div>
              <div className="absolute w-48 h-48 bg-blue-300 rounded-full opacity-20 bottom-10 right-10"></div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 relative">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: <Building className="h-10 w-10 mb-2" />,
                      title: "Property Management",
                    },
                    {
                      icon: <Users className="h-10 w-10 mb-2" />,
                      title: "Tenant Verification",
                    },
                    {
                      icon: <Wrench className="h-10 w-10 mb-2" />,
                      title: "Maintenance Requests",
                    },
                    {
                      icon: <FileText className="h-10 w-10 mb-2" />,
                      title: "Document Manager",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white/10 rounded-xl p-4 flex flex-col items-center text-center"
                    >
                      {feature.icon}
                      <h3 className="font-medium text-sm">{feature.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
