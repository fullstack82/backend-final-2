const { database } = require('../structure');



async function getReservations(req, res) {
    try {
        const [reservations] = await database.pool.query('SELECT * FROM reservations');
        res.send(reservations);
    } catch (err) {
        res.status(500);
        res.send({ error: err.message });
    }
};




module.exports = {
    getReservations
}