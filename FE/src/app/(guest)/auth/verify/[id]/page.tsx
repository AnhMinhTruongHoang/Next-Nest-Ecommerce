import AuthVerify from "@/components/auth/auth.verify";

const VerifyPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <>
      <AuthVerify id={id} />
    </>
  );
};

export default VerifyPage;
