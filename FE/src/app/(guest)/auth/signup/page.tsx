import { authOptions } from "@/app/api/auth/[...nextauth]/auth.options";
import AuthSignUp from "@/components/auth/auth.register";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    // redirect to homepage
    redirect("auth/signin");
  }
  return <AuthSignUp />;
};

export default SignUpPage;
