
// 1. Requiring the modules.--------------------------------------------------------------------------------------------------------------------------------------------
const Joi = require('joi');

const { database } = require('../structure');

// 2. Create a review for the user who comes with a token.------------------------------------------------------------------------------------------------------------------
async function createReview(req, res) {
    try {
        const { experiencesId } = req.params;
        const { id } = req.auth;
        const { date, rating } = req.body;


        const schema = Joi.object({
            date: Joi.date(),
            rating: Joi.number().min(1).max(5).required(),
        });

        await schema.validateAsync({ date, rating });


        const selectQuery = 'SELECT * FROM comments WHERE id = ?';
        const [comments] = await database.pool.query(selectQuery, experiencesId);


        if (!comments || !comments.length) {
            const error = new Error('The comments you are looking for does not exist');
            err.code = 404;
            throw error;
        };
        const { usersId} = req.params;
        const insertQuery = 'INSERT INTO reservations(id_users, id_experiences,  rating, date) VALUES (?,  ?, ?, ?)';
        const [rows] = await database.pool.query(insertQuery,[usersId, experiencesId, rating, date] );


        res.status(201);
        res.send(rows[0]);


    } catch (err) {
        res.status(res.code || 500);
        res.send({ error: err.message });

    }
}

// 3. Look for the reviews that correspond to the user
async function getReviewsByUserId(req, res) {
    try {
        const { usersId } = req.params;

        if (Number(usersId) !== req.auth.id) {
            const error = new Error('The user does not have any authorization');
            err.code = 403;
            throw error;
        }

        const query = 'SELECT * FROM comments WHERE users';
        const [comments] = await database.pool.query(query, usersId);
        res.send(comments);


    } catch (err) {
        res.status(err.code || 500);
        res.send({ error: err.message });
    }
}

// 4. The user can modify a review about the experiences
async function modifyReview(req, res) {
    try {
        const { commentsId } = req.params;
        const { rating, date } = req.body;

        const schema = Joi.object({
            rating: Joi.number().min(1).max(5).required(),
            date: Joi.date()
        });

        await schema.validateAsync({ date, rating });

        const query = 'SELECT * FROM comments WHERE id = ?';
        const [comments] = await database.pool.query(query, commentsId);


        if(!comments || !comments.length) {
            const error = new Error('The review you are looking for does not exist');
            error.code = 404;
            throw error;
        };


        const review = reviews[0];

        if(comments.user_id !== req.auth.id) {
            const error = new Error('The user does not have the necessary permissions');
            error.code = 4063;
            throw error;
        };

        const updateRating = 'UPDATE comments SET rating = ?, date = ? WHERE id = ?';
        await database.pool.query(updateRating, [rating, date, commentsId]);


        const selectQuery = 'SELECT * FROM comments WHERE id = ?';
        const [selectRows] = await database.pool.query(selectQuery, commentsId);

        res.send(selectRows[0]);


    }catch(err){
        res.status(err.code || 500);
        res.send({ error: err.message });
    }
};



module.exports = {
    createReview,
    getReviewsByUserId,
    modifyReview
}