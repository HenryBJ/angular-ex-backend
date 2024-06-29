require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Todo = require('./models/todo');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

// Verificar conexión a MongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});



// Endpoints
// Crear una nueva tarea
app.post('/todos', async (req, res) => {
  console.log(req.body)
    try {
      const todo = new Todo({
        title: req.body.title,
        description: req.body.description,
        complete: req.body.complete,
      });
      const savedTodo = await todo.save();
      res.status(201).json(savedTodo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

// Obtener todas las tareas
app.get('/todos', async (req, res) => {
    try {
      const todos = await Todo.find();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });  

  // Obtener una tarea por ID
app.get('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      console.log(todo)
      res.json(todo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Actualizar una tarea por ID
app.put('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          description: req.body.description,
          complete: req.body.complete,
        },
        { new: true } // Devolver el documento actualizado
      );
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.json(todo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Eliminar una tarea por ID
app.delete('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findByIdAndDelete(req.params.id);
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.json({ message: 'Todo deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

app.get('/', (req, res) => {
    res.send('TO-Do Backend!');
  });

app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});