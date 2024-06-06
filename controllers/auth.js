const mysql = require("mysql");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

//register user to the database
    exports.register = (req, res) => {
        console.log(req.body);

        const{name, email, password, confirmPassword} = req.body;
        
        db.query('SELECT email FROM user_cred where email = ?', [email], async(error, results) =>{
        if(error){
            console.log(error);
            return res.status(500).send('An error occurred while checking email');
        }
         if(results.length > 0){
            return res.render('register', { 
                message: 'email is already in use'
            })
         }else if(password !== confirmPassword){
            return res.render('register', {
                message: 'Passwords do not match'
                
            })
         }

         try {
            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);


            db.query('INSERT INTO user_cred set ?', {name: name, email: email, password: hashedPassword}, (error, results) => {
                if(error){
                    console.log(error)
                }else{
                    console.log(results)
                    return res.render('register', {
                        message: 'User Registered'
                        
                    })
                }
            })
            // Sending the response after hashing the password
            //res.send("testing");
        } catch (err) {
            console.log(err);
            return res.status(500).send('An error occurred while hashing password');
        }
    })
    
    // res.send("form submitted");
}

//Authenticate User during login
exports.login = (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM user_cred WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('An error occurred while checking email');
        }
        if (results.length === 0) {
            return res.render('index', { message: 'Invalid email or password' }); // Render 'index' view
        }
        const user = results[0];
        try {
            if (await bcrypt.compare(password, user.password)) {
                // Passwords match, generate JWT token
                const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
                    expiresIn: 5 // 5 sec expiration
                });
                // Store token in cookie
                const expiresInMilliseconds = process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000;
                res.cookie('jwt', token, {
                    expires: new Date(Date.now() + expiresInMilliseconds),
                    httpOnly: true
                });
                return res.redirect('/home'); // Redirect to home page
            } else {
                return res.render('index', { message: 'Invalid email or password' }); // Render 'index' view
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send('An error occurred while logging in');
        }
    });
};



//retrieve user from the data base and put it into the table
exports.getUsers = (req, res) => {
    db.query('SELECT * FROM hero_data', (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('An error occurred while fetching user data');
        }
        res.render('home', { heroes: results });
    });
};


exports.addHero = (req, res) => {
    console.log(req.body);

    const { name, buildtype, charLevel } = req.body;
    
    try {
        db.query('INSERT INTO hero_data SET ?', { name: name, build_type: buildtype, level: charLevel }, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('An error occurred while adding the hero');
            } else {
                console.log(results);
                
                // Fetch the updated list of heroes from the database
                db.query('SELECT * FROM hero_data', (error, results) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).send('An error occurred while fetching heroes');
                    }
                    const heroes = results;
                    
                    // Render the home page with the updated list of heroes
                    return res.render('home', { heroes: heroes });
                });
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send('An error occurred while adding the hero');
    }
};

exports.deleteHero = (req, res) => {
    const { id } = req.body;

    db.query('DELETE FROM hero_data WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('An error occurred while deleting the hero');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Hero not found');
        }
        // Redirect back to the home page after deletion
        res.redirect('/home');
    });
};

exports.updateHero = (req, res) => {
    const { id, name, buildtype, charLevel } = req.body;

    // Update the hero data in the database
    db.query('UPDATE hero_data SET name=?, build_type=?, level=? WHERE id=?', [name, buildtype, charLevel, id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('An error occurred while updating the hero');
        }
        
        // Redirect back to the home page after updating
        res.redirect('/home');
    });
};

exports.logout = (req, res) => {
    // Clear the JWT token stored in the user's browser
    res.clearCookie('jwt');
    // Redirect the user to the login page
    res.redirect('/'); // or any other appropriate route
};





