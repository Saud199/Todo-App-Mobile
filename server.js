const mongoose = require("mongoose");
const express = require("express");

const app = express();

//  Middleware
app.use(express.json());

//  Database Connection
//const db = 'mongodb://localhost/todoDB';      // Connection with Local MongoDB Database

const db = 'mongodb+srv://john_smith:finalproject@todo.8w4dh.mongodb.net/todoDB?retryWrites=true&w=majority'; // Connection with MongoDB Atlas (Online)   // johnsmithgizmo893@gmail.com


mongoose.connect(db , {
    useCreateIndex: true,
    useUnifiedTopology: true,       // Giving Permissions
    useNewUrlParser: true

})
.then(() => console.log('Connected to MongoDB Database !!!'))
.catch(err => console.log('Database Connection Error :'+err))


//  Use Routes
app.use('/api/todoDB' , require('./routes/todoRoutes.js'))


// Listen to Port

if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static('client/build'));

    app.get('*' , (req , res) => {
        res.sendFile(path.resolve(__dirname , 'client' , 'build' , 'index.html'));
    });
}

const port = process.env.PORT || 5000;

app.listen(port , () => {
    console.log('Server is started on port : '+port);
});

