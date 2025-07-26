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
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Link from "next/link";
import { useState } from "react";

const SignUpPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
    avatarUrl: "",
  });

  const fields = Object.keys(form) as (keyof typeof form)[];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Submit:", form);
    // Gọi API tại đây nếu muốn
  };

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", py: 6 }}>
      //@ts-ignore
      <Grid container justifyContent="center" alignItems="center">
        <Grid>
          <Link href="/" style={{ position: "absolute", top: 16, left: 16 }}>
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
          </Link>

          <Box textAlign="center" mb={3}>
            <Avatar sx={{ bgcolor: "primary.main", mx: "auto", mb: 1 }}>
              <LockOpenIcon />
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              Sign Up
            </Typography>
          </Box>

          {fields.map((field) => (
            <TextField
              key={field}
              name={field}
              type={field === "password" ? "password" : "text"}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              fullWidth
              margin="normal"
              value={form[field]}
              onChange={handleChange}
            />
          ))}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignUpPage;
