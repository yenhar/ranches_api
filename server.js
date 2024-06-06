const express = require("express")
const path = require('path');
const mysql = require("mysql")
const dotenv = require("dotenv");

dotenv.config({path: './.env'});

const app = express()

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});



console.log(__dirname);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'))


const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory));

//Parse url-encoded bodies as sent by HTML forms
app.use(express.urlencoded({extended: false}));
//Parse JSON bodies (as send by API Clients)
app.use(express.json());

app.use('/assets',express.static('assets'));

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));





db.connect((error) => {
    if(error){
        console.log(error)
    }else{
        console.log("mysql connected....")
    }
})




// app.get("/", (req, res) => {
//     res.render("views/index", {})

// })

// app.get("/home", (req, res) => {
//     res.render("views/home", {})

// })
// app.get("/", (req, res) => {
//     res.send("<h1>Home Page</h1>")

// })




app.listen(3001, () => {
    console.log("server started in 3001")
})

