"use client";

// components/Footer.tsx
import React from "react";
import {
  Box,
  Typography,
  Container,
  IconButton,
  TextField,
  Button,
  Link as MuiLink,
  Grid,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Google,
  Instagram,
  LinkedIn,
  GitHub,
} from "@mui/icons-material";

const AppFooter = () => {
  const links = ["Link 1", "Link 2", "Link 3", "Link 4"];

  return (
    <Box sx={{ backgroundColor: "#212121", color: "#fff", pt: 4, pb: 2 }}>
      <Container maxWidth="lg">
        {/* Social Icons */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          {[Facebook, Twitter, Google, Instagram, LinkedIn, GitHub].map(
            (Icon, index) => (
              <IconButton key={index} color="inherit" sx={{ mx: 1 }}>
                <Icon />
              </IconButton>
            )
          )}
        </Box>

        {/* Newsletter */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Sign up for our newsletter
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Email address"
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          />
          <Button
            variant="outlined"
            sx={{ color: "#fff", borderColor: "#fff", height: "40px" }}
          >
            Subscribe
          </Button>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{ color: "#ccc", textAlign: "center", mb: 4 }}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
          distinctio earum repellat quaerat voluptatibus placeat nam, commodi
          optio pariatur est quia magnam eum harum corrupti dicta, aliquam sequi
          voluptate quas.
        </Typography>

        <Grid container spacing={4} justifyContent="center" mb={4}>
          {[1, 2, 3, 4].map((col) => (
            //@ts-ignore
            <Grid item xs={6} sm={3} key={col} component="div">
              <Typography variant="h6" gutterBottom>
                LINKS
              </Typography>
              {links.map((link, idx) => (
                <MuiLink
                  key={idx}
                  href="#"
                  underline="hover"
                  sx={{ display: "block", color: "#ccc", mb: 1 }}
                >
                  {link}
                </MuiLink>
              ))}
            </Grid>
          ))}
        </Grid>

        {/* Bottom Text */}
        <Box
          sx={{
            textAlign: "center",
            py: 2,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            fontSize: 14,
          }}
        >
          © 2025 Copyright:&nbsp;
          <MuiLink href="https://mui.com" color="inherit" underline="hover">
            Material UI
          </MuiLink>
        </Box>
      </Container>
    </Box>
  );
};

export default AppFooter;
