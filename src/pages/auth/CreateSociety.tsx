
import AuthLayout from "@/components/auth/AuthLayout";
import { SocietyForm } from "@/components/society/SocietyForm";

const CreateSociety = () => {
  return (
    <AuthLayout 
      title="Create Your Society" 
      subtitle="Set up details for the residential society you manage"
      userType="admin"
    >
      <SocietyForm />
    </AuthLayout>
  );
};

export default CreateSociety;
