"use client";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const AuthSignIn = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isErrorUsername, setIsErrorUsername] = useState(false);
  const [isErrorPassword, setIsErrorPassword] = useState(false);

  const [errorUsername, setErrorUsername] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const [openMessage, setOpenMessage] = useState(false);
  const [resMessage, setResMessage] = useState("");

  const handleSubmit = async () => {
    setIsErrorUsername(false);
    setIsErrorPassword(false);
    setErrorUsername("");
    setErrorPassword("");

    if (!username) {
      setIsErrorUsername(true);
      setErrorUsername("Username is required.");
      return;
    }
    if (!password) {
      setIsErrorPassword(true);
      setErrorPassword("Password is required.");
      return;
    }

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (!res?.error) {
      router.push("/");
    } else {
      setOpenMessage(true);
      setResMessage(res.error);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", py: 6 }}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100%" }}
      >
        <Grid>
          <Link href="/" style={{ position: "absolute", top: 16, left: 16 }}>
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
          </Link>

          <Box textAlign="center" mb={3}>
            <Avatar sx={{ bgcolor: "primary.main", mx: "auto", mb: 1 }}>
              <LockIcon />
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              Sign In
            </Typography>
          </Box>

          <TextField
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Username"
            name="username"
            autoFocus
            error={isErrorUsername}
            helperText={errorUsername}
          />

          <TextField
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            error={isErrorPassword}
            helperText={errorPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Sign In
          </Button>

          <Divider>Or sign in with</Divider>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              mt: 3,
            }}
          >
            <Avatar
              sx={{ cursor: "pointer", bgcolor: "#333" }}
              onClick={() => signIn("github")}
            >
              <GitHubIcon />
            </Avatar>
            <Avatar
              sx={{ cursor: "pointer", bgcolor: "#db4437" }}
              onClick={() => signIn("google")}
            >
              <GoogleIcon />
            </Avatar>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={openMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={5000}
        onClose={() => setOpenMessage(false)}
      >
        <Alert
          onClose={() => setOpenMessage(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {resMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuthSignIn;
