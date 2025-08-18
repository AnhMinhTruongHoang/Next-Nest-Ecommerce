import { authOptions } from "@/app/api/auth/[...nextauth]/auth.options";
import AuthSignIn from "@/components/auth/auth.signin";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    // redirect to homepage
    redirect("/");
  }
  return (
    <>
      <AuthSignIn />
    </>
  );
};

export default SignInPage;
