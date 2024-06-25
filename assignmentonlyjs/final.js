const express = require('express');
const app = express();
const port = 20008;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log("Server running on port ${port}!");
});

let todos = [
    { work: "Start production for summer covers on my second song", durationInHrs: 3 },
    { work: "Go for Haircut", durationInHrs: 1 },
    { work: "Record Vocals", durationInHrs: 3 },
    { work: "Complete SOC Assignment", durationInHrs: 3 }
];

// GET route to retrieve the todo list
app.get("/todolist", (request, response) => {
    response.send(todos);
});

// GET route to retrieve a specific todo by work
app.get("/todolist/:work", (request, response) => {
    const { work } = request.params;
    const todowork = todos.find(t => t.work === work);
    if (todowork) {
        response.send(todowork);
    } else {
        response.status(404).send({ error: "Todo not found" });
    }
});

// POST route to add a new todo
app.post("/todolist", (request, response) => {
    const newTodo = request.body;
    todos.push(newTodo);
    response.status(201).send(todos);
});

// DELETE route to delete a specific todo by work
app.delete("/todolist/:work", (request, response) => {
    const { work } = request.params;
    const originalLength = todos.length;
    const filteredTodos = todos.filter(todo => todo.work !== work);
    if (filteredTodos.length < originalLength) {
        // If any todo is removed
        todos = filteredTodos; // Update todos array with filtered todos
        response.status(200).send({ message: "Todo deleted successfully", remainingTodos: filteredTodos });
    } else {
        response.status(404).send({ error: "Todo not found" });
    }
});
// PUT route to update a specific todo by work ID
app.put("/todolist/:work", (request, response) => {
    const { work } = request.params;
    const updatedTodo = request.body;

    // Find the todo item with the specified work ID
    const todoToUpdate = todos.find(todo => todo.work === work);

    if (todoToUpdate) {
        // Update the todo item with the new data
        Object.assign(todoToUpdate, updatedTodo);
        response.status(200).send(todoToUpdate);
    } else {
        response.status(404).send({ error: "Todo not found" });
    }
});
