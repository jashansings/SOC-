var express = require('express');
var fs = require('fs');
var app = express();
var port = 20008;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Function to read todos from the JSON file
var readTodosFromFile = function() {
    try {
        var data = fs.readFileSync('todos.json', 'utf8');
        var jsonData = JSON.parse(data);
        return jsonData.todos;
    } catch (err) {
        console.error(err);
        return [];
    }
};

// Function to write todos to the JSON file
var writeTodosToFile = function(todos) {
    try {
        var jsonData = { todos: todos };
        fs.writeFileSync('todos.json', JSON.stringify(jsonData, null, 2));
    } catch (err) {
        console.error(err);
    }
};

app.listen(port, function() {
    console.log(`Server running on port ${port}!`);
});

// GET route to retrieve the todo list
app.get('/todolist', function(request, response) {
    var todos = readTodosFromFile();
    response.send(todos);
});

// GET route to retrieve a specific todo by work
app.get('/todolist/:work', function(request, response) {
    var work = request.params.work;
    var todos = readTodosFromFile();
    var todowork = todos.find(function(t) { return t.work === work; });
    if (todowork) {
        response.send(todowork);
    } else {
        response.status(404).send({ error: 'Todo not found' });
    }
});

// POST route to add a new todo
app.post('/todolist', function(request, response) {
    var newTodo = request.body;
    var todos = readTodosFromFile();
    todos.push(newTodo);
    writeTodosToFile(todos);
    response.status(201).send(todos);
});

// DELETE route to delete a specific todo by work
app.delete('/todolist/:work', function(request, response) {
    var work = request.params.work;
    var todos = readTodosFromFile();
    var originalLength = todos.length;
    var filteredTodos = todos.filter(function(todo) { return todo.work !== work; });
    if (filteredTodos.length < originalLength) {
        writeTodosToFile(filteredTodos);
        response.status(200).send({ message: 'Todo deleted successfully', remainingTodos: filteredTodos });
    } else {
        response.status(404).send({ error: 'Todo not found' });
    }
});

// PUT route to update a specific todo by work
app.put('/todolist/:work', function(request, response) {
    var work = request.params.work;
    var updatedTodo = request.body;
    var todos = readTodosFromFile();
    var todoToUpdate = todos.find(function(todo) { return todo.work === work; });

    if (todoToUpdate) {
        Object.assign(todoToUpdate, updatedTodo);
        writeTodosToFile(todos);
        response.status(200).send(todoToUpdate);
    } else {
        response.status(404).send({ error: 'Todo not found' });
    }
});