import React, { useEffect, useState } from "react";
import service from "../service";
import { TextField, List, ListItem, ListItemText, Checkbox, IconButton, Paper, Typography } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";


export default function Todos() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  async function getTodos() {
    const result = await service.getTasks();
    setTodos(result);
  }

  async function createTodo(e) {
    e.preventDefault();
    await service.addTask(newTodo);
    setNewTodo(""); // לנקות את השדה
    await getTodos(); // לרענן את הרשימה
  }

  async function updateCompleted(todo, isComplete) {
    await service.setCompleted(todo.id, isComplete);
    await getTodos(); // לרענן את הרשימה
  }

  async function deleteTodo(id) {
    await service.deleteTask(id);
    await getTodos(); // לרענן את הרשימה
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <Paper elevation={3} style={{ padding: 16, maxWidth: 400, margin: "auto", marginTop: 20 }}>
       <Typography variant="h4" align="center" gutterBottom>
        TODOS
      </Typography>
      <form onSubmit={createTodo} style={{ display: "flex", marginBottom: 16 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Well, let's take on the day"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
      </form>
      <List>
        {todos.map((todo) => (
          <ListItem
            key={todo.id}
            divider
            onMouseEnter={() => setHoveredId(todo.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "#f5f5f5",
              marginBottom: "8px",
              transition: "background-color 0.3s",
            }}
          >
            {/* {hoveredId === todo.id && (
             
            )} */}
            <ListItemText
              primary={todo.name}
              style={{
                textDecoration: todo.isComplete ? "line-through" : "none",
                flexGrow: 1,
              }}
            />
            {hoveredId === todo.id && (
              <>
              <IconButton edge="end" onClick={() => deleteTodo(todo.id)}>
                <DeleteIcon />
              </IconButton>
               <Checkbox
               checked={todo.isComplete}
               onChange={(e) => updateCompleted(todo, e.target.checked)}
             /></>
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

