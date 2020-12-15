// 1.  Requiring the modules.-------------------------------------------------------------------------------------------------------------------------------------------
const jwt = require('jsonwebtoken');

const { database } = require('../structure');
// 2. User validation is created.--------------------------------------------------------------------------------------------------------------------------------------
async function validateAuthorization(req, res, next) {
    try {
        const { authorization } = req.headers;

        if (!authorization || !authorization.startsWith('Bearer ')) {

            const error = new Error('Authorization header required');
            error.code = 401;
            throw error;
        }

        const token = authorization.slice(7, authorization.length);
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);


// 3. It was verified that the user for whom the token was issued still exists.-----------------------------------------------------------------------------------------
        const query = 'SELECT * FROM users WHERE id = ?';
        const [users] = await database.pool.query(query, decodedToken.id);

        if (!users || !users.length) {
            const error = new Error( 'Authorization: el usuario no existe');
            error.code = 401;
            throw error;
        }

        req.auth = decodedToken;
        next();

    } catch (err) {
        res.status(err.code || 500);
        res.send({ error: err.message });
    }
}
// 4. Exporting the modules.-------------------------------------------------------------------------------------------------------------------------------------------
module.exports = { validateAuthorization };