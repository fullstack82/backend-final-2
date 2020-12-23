const { database } = require('../structure');
const Joi = require('joi');
const { string, number, date } = require('joi');


async function getReservations(req, res) {
    try {
        const [reservations] = await database.pool.query('SELECT * FROM reservations');
        res.send(reservations);
    } catch (err) {
        res.status(500);
        res.send({ error: err.message });
    }
};


/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*async function createReservations(req, res) {
    try {
        const [reservationId] = req.params;
        const { id } = req.auth;
        const { reservation } = req.body;



        const schema = Joi.object({
            name: Joi.string(),
            surnames: Joi.string(),
            email: Joi.string(),
            card: Joi.number()
        });

        await schema.validateAsync({ name, surnames, email, card });


        const selectQuery = 'SELECT * FROM reservations WHERE id = ?';
        const [reservations] = await database.pool.query(selectQuery, reservationId)


        if (!reservations || !reservations.length) {
            const error = new Error('la reserva no existe');
            error.code = 404;
            throw error;
        }



        const insertQuery = 'INSERT INTO reservations( experiences INNER JOIN users on experiences.id = users.id) VALUES (?, ?)';
        const [result] = await database.pool.query(insertQuery, [experiences, users]);

        const { insertId } = result;
        

        const query = 'SELECT * FROM reservations WHERE id = ?';
        const [booking] = await database.pool.query(query, insertId);


        res.status(201);
        res.send(booking[0])




    } catch (error) {
        res.status(error.code || 500);
        res.send({ error: err.message })

    }
};*/




module.exports = {
    getReservations,
    createReservations
}