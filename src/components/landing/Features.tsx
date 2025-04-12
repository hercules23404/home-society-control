
import React from "react";
import {
  Building,
  FileCheck,
  Bell,
  Wrench,
  Users,
  Shield,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Bell className="h-8 w-8 text-rental-primary" />,
      title: "Society Notices",
      description:
        "Stay informed with important updates and announcements from your society administration.",
    },
    {
      icon: <Wrench className="h-8 w-8 text-rental-primary" />,
      title: "Maintenance Requests",
      description:
        "Submit and track service requests with ease. Get timely resolutions to your maintenance issues.",
    },
    {
      icon: <Building className="h-8 w-8 text-rental-primary" />,
      title: "Property Listings",
      description:
        "Discover available properties within your society or list your own property for rent or sale.",
    },
    {
      icon: <FileCheck className="h-8 w-8 text-rental-primary" />,
      title: "Document Management",
      description:
        "Securely store and share important documents with your society administration.",
    },
    {
      icon: <Users className="h-8 w-8 text-rental-primary" />,
      title: "Tenant Verification",
      description:
        "Streamlined verification process for new tenants with secure document submission.",
    },
    {
      icon: <Shield className="h-8 w-8 text-rental-primary" />,
      title: "Admin Dashboard",
      description:
        "Powerful tools for society administrators to manage residents, notices, and requests.",
    },
  ];

  return (
    <section className="py-16 bg-rental-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-rental-text mb-4">
            Everything You Need for Efficient Society Management
          </h2>
          <p className="text-rental-text-light max-w-2xl mx-auto">
            Our comprehensive platform provides all the features needed for
            seamless society management and improved resident experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300"
            >
              <div className="mb-4 inline-block p-3 bg-blue-50 rounded-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-rental-text">
                {feature.title}
              </h3>
              <p className="text-rental-text-light">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
