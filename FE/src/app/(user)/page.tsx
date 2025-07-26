import { Container } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.options";

export default async function HomePage() {
  const session = getServerSession(authOptions);

  //////////////////
  return (
    <Container>
      <div>
        <h1>home page</h1>
      </div>
    </Container>
  );
}
