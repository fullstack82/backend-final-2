// 1. Require the database.------------------------------------------------------------------------------------------------------------------------------------------
const { database } = require('../structure');


// 2. Look for all experiences in the database.----------------------------------------------------------------------------------------------------------------------
async function getExperiences(req, res) {
    try {
        const [experiences] = await database.pool.query('SELECT * FROM experiences');
        res.send(experiences);
    } catch (err) {
        res.status(500);
        res.send({ error: err.message });
    }
}


// 3. .---------------------------------------------------------------------------------------------------------------------
async function getExperiencesById(req, res) {
    try {
        const { id } = req.params;

        const [experiences] = await database.pool.query('SELECT * FROM experiences WHERE id = ?', id);

        if (experiences.lenght === 0) {
            const error = new Error('la experiencia que buscas no existe.');
            error.code = 404;
            throw error;
        }
        res.send(experiences[0]);

    } catch (error) {
        res.status(500);
        res.send({ error: error.message })
    }
}





module.exports = {
    getExperiences,
    getExperiencesById,
}