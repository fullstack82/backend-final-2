// 1. Requiring the modules.--------------------------------------------------------------------------------------------------------------------------------------------
const { database } = require('../structure');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// 2. See the users already registered in my database.-----------------------------------------------------------------------------------------------------------------
async function getUsers(req, res) {
    try {
        const users = await database.pool.query('SELECT * FROM users');
        res.send(users[0]);
    } catch (err) {
        res.status(500);
        res.send({ error: err.message })
    }
}


// 3. Register a new User --------------------------------------------------------------------------------------------------------------------------------------------

async function createUser(req, res) {
    try {
        const { name, surnames, email, userName, password } = req.body;


        const userSchema = Joi.object({
            name: Joi.string().required().min(5).max(20),
            surnames: Joi.string().required(),
            email: Joi.string().email().required(),
            userName: Joi.string().alphanum().min(5).max(20),
            password: Joi.string().min(3).max(10).required().alphanum()
        });
        await userSchema.validateAsync({ name, surnames, email, userName, password });



        const dataConfirm = 'SELECT * FROM users WHERE email = ?';
        const [users] = await database.pool.query(dataConfirm, email);


        if (users.length) {
            const err = new Error('There is already a user with that email');
            err.code = 409;
            throw err;
        }


        const userNameConfirm = 'SELECT * FROM users WHERE userName = ?';
        const [userNames] = await database.pool.query(userNameConfirm, userName);


        if (userNames.length) {
            const err = new Error('There is already a user with that nickname');
            err.code = 409;
            throw err;
        }


        const passwordHash = await bcrypt.hash(password, 10);
        const insertQuery = 'INSERT INTO users(name,surnames, userName, email, password) VALUES (?, ?, ?, ?, ?)';
        const [rows] = await database.pool.query(insertQuery, [name, surnames, userName, email, passwordHash]);

        const createId = rows.insertId;


        const selectQuery = 'SELECT * FROM users WHERE id = ?';
        const [[user]] = await database.pool.query(selectQuery, createId);


        const Payload = { id: user.id, role: user.role };


        const token = jwt.sign(
            Payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
        );
        res.send({ ...user, token });


    } catch (err) {
        res.status(err.code || 500);
        res.send({ error: err.message });
    }
}



//4. Login---------------------------------------------------------------------------------------------------------------------------------------------------------
async function login(req, res) {
    try {
        const { email, userName, password } = req.body;

        const schema = Joi.object({
            email: Joi.string().email(),
            userName: Joi.string().alphanum().min(5).max(20).required(),
            password: Joi.string().min(3).max(10).required().alphanum()
        });


        await schema.validateAsync({ email, userName, password });

        const [result] = await database.pool.query('SELECT * FROM users WHERE email = ? OR userName = ?', [email, userName]);

        if (!result || !result.length) {
            const error = new Error('The user does not exist or the data is not correctly entered');
            error.code = 401;
            throw error;
        }

        const user = result[0];

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            const error = new Error('The password entered is not correct');
            error.code = 401;
            throw error;
        }

        const Payload = { id: user.id, role: user.role };


        const token = jwt.sign(
            Payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
        );
        res.header({ Authorization: 'Bearer ' + token }).send({ token });
    } catch (err) {
        res.status(500);
        res.send({ error: err.message });
    }
}


// 5. Edit user profile.-----------------------------------------------------------------------------------------------------------------------------------------------
async function editProfile(req, res) {
    try {
        const { id } = req.auth;

        const { name, surnames, email, userName } = req.body;


        const schema = Joi.object({
            name: Joi.string().required().min(5).max(20),
            surnames: Joi.string().required(),
            email: Joi.string().email().required(),
            userName: Joi.string().alphanum().min(5).max(20),

        });
        await schema.validateAsync({ name, surnames, email, userName });

        const updateQuery = ('UPDATE users SET name = ?, surnames = ?, email = ?, userName = ?  WHERE id = ?');


        await database.pool.query(updateQuery, [name, surnames, email, userName, id]);


        const selectQuery = 'SELECT * FROM users WHERE id = ?';
        const [selectRows] = await database.pool.query(selectQuery, id);


        res.send(selectRows[0]);


    } catch (err) {
        res.status(500);
        res.send({ error: err.message });
    }
}

// 6. Exporting users controls.----------------------------------------------------------------------------------------------------------------------------------------

module.exports = {
    getUsers,
    createUser,
    login,
    editProfile,
}