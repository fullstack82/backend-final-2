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
async function createReservations(req, res) {
    try {
        
        const { id } = req.auth;
        const { reservation, experiencia } = req.body;



      /*  const schema = Joi.object({
            name: Joi.string(),
            surnames: Joi.string(),
            email: Joi.string(),
            card: Joi.number()
        });

        await schema.validateAsync({ name, surnames, email, card });*/

console.log([reservation, experiencia, id])


        const insertQuery = 'INSERT INTO reservations( reservation_number, id_experiences, id_users, reservation_date) VALUES (?, ?, ?, ?)';
        const [result] = await database.pool.query(insertQuery, [reservation, experiencia, id, new Date()]);

        const { insertId } = result;
        

        const query = 'SELECT * FROM reservations WHERE id = ?';
        const [booking] = await database.pool.query(query, insertId);


        res.status(201);
        res.send(booking[0])




    } catch (error) {
        console.log(error)
        res.status(error.code || 500);
        res.send({ error: error.message })

    }
};




module.exports = {
    getReservations,
    createReservations
}