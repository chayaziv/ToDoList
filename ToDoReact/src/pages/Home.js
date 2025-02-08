import * as React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <FormatListBulletedIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to ToDoList App
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Organize your tasks efficiently and stay productive!
        </Typography>
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddTaskIcon />}
            onClick={() => navigate("/todos")}
            sx={{ mr: 2 }}
          >
            View Tasks
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

