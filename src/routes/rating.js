'use strict';

const express = require('express');
const { ratings } = require('../models/index.js');
const authenticateBearer = require('../auth/middleware/bearer')
const { Sequelize } = require('sequelize');
const router = express.Router();


// === === routers === === //
router.put('/services/:servicesId/rating', authenticateBearer, update);


async function update(request, response) {
  try {
    const { servicesId } = request.params;
    const { rating } = request.body;
    console.log('rating is: ', rating);
    const ratingData = await ratings.findOne({ where: { service_id: servicesId, user_id: request.user.id } });
    console.log('rating data is: ', ratingData);

    let res;
    if (!ratingData) {
      // create row here, use .create
      // the 3 items you want, user_id, service_id, and rating
      res = await ratings.create({ rating, user_id: request.user.id, service_id: servicesId });
      console.log('RES FOR RATING .CREATE IS: ', res)

    } else {
      // rating exists, update existing rating here
      res = await ratings.update({ rating }, { where: { user_id: request.user.id, service_id: servicesId } });
      console.log('RES FOR RATING .UPDATE IS: ', res)
    }

    const averageRatings = await ratings.findAll({
      where: { service_id: servicesId },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating'],
        [Sequelize.fn('count', Sequelize.col('rating')), 'totalRatings'],
      ],
    })

    console.log(averageRatings, 'average ratings')

    response.status(200).send({ success: res, data: averageRatings, message: res ? 'Rating Added!' : 'Error Adding Rating!' });

  } catch (error) {
    console.log(error)
    response.status(500).send(error);
  }
}


module.exports = router;
