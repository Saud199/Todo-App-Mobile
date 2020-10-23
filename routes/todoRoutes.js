const express = require("express");
const router = express.Router();


// Importing Model
const Todo = require('../models/todoModel.js');


// Get Todo
router.get('/' , (req , res) => {
    Todo.find()
        .sort({date : -1})          // -1 means descending order
        .then((todos) => res.json(todos))       // "todos" is the Collection Name in the Database
});


//  Add Todo
router.post('/' , (req , res) => {
    const newTodo = new Todo({
        name : req.body.name
    })

    newTodo.save().then((todo) => res.json(todo))
});


//  Delete Todo
router.delete('/:id' , (req , res) => {
    Todo.findById(req.params.id)
        .then((todo) => todo.remove().then(() => res.json({success : true})))
        .catch(err => res.json({success : false}).status(404))
});


//  Update Todo
router.put('/:id', (req , res) => {
    Todo.findByIdAndUpdate(req.params.id , {name : req.body.name} , {new : true})
        //.then(res.json({success : true}))
        .then((todo) => res.json(todo))
        .catch(err => res.json({success : false}).status(404))      // Check
});


//  Exporting Router
module.exports = router;
