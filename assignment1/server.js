const express = require('express');
const path = require('path');
const app = express();
const port = 20008;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let todos = [
    { work: "1. Start production for summer covers on my second song", durationInHrs: 3 },
    { work: "2. Go for Haircut", durationInHrs: 1 },
    { work: "3. Record Vocals", durationInHrs: 3 },
    { work: "4. Complete SOC Assignment", durationInHrs: 3 }
];

// Serve the static HTML file
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// API routes
app.get("/api/todolist", (request, response) => {
    response.json(todos);
});

app.get("/api/todolist/:work", (request, response) => {
    const { work } = request.params;
    const todowork = todos.find(t => t.work === work);
    if (todowork) {
        response.json(todowork);
    } else {
        response.status(404).json({ error: "Todo not found" });
    }
});

app.post("/api/todolist", (request, response) => {
    const newTodo = request.body;
    todos.push(newTodo);
    response.status(201).json(newTodo);
});

app.delete("/api/todolist/:work", (request, response) => {
    const { work } = request.params;
    const originalLength = todos.length;
    const filteredTodos = todos.filter(todo => todo.work !== work);
    if (filteredTodos.length < originalLength) {
        todos = filteredTodos;
        response.status(200).json({ message: "Todo deleted successfully", remainingTodos: filteredTodos });
    } else {
        response.status(404).json({ error: "Todo not found" });
    }
});

app.put("/api/todolist/:work", (request, response) => {
    const { work } = request.params;
    const updatedTodo = request.body;
    const todoToUpdate = todos.find(todo => todo.work === work);

    if (todoToUpdate) {
        Object.assign(todoToUpdate, updatedTodo);
        response.status(200).json(todoToUpdate);
    } else {
        response.status(404).json({ error: "Todo not found" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}!`);
});
