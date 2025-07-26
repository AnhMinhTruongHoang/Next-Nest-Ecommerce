"use client";

import Link from "next/link";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";

export default function NotFound() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <SearchOffIcon color="error" sx={{ fontSize: 60 }} />
          <Typography variant="h4" fontWeight="bold">
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sorry, the page you are looking for does not exist or has been
            moved.
          </Typography>
          <Button
            component={Link}
            href="/"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Return Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
