'use strict';

const express = require('express');
const { services, db } = require('../models/index.js');
const authenticateBearer = require('../auth/middleware/bearer')

const data = require('../models/index.js');
const { QueryTypes } = require('sequelize');
const router = express.Router();


// === === routers === === //
// router.post('/services', create);
router.post('/services', authenticateBearer, create)
router.get('/services', getAll);
router.get('/services/:servicesId', getOne);
router.put('/services/:servicesId', authenticateBearer, update);
router.delete('/services/:servicesId', authenticateBearer, remove);


// === === router functions === === //
////////////// this is the old CREATE ///////////////////
// async function create(request, response) {
//   const servicesObject = request.body;
//   console.log('🎲services object', servicesObject);
//   const servicesData = await data.services.create(servicesObject);

//   response.status(200).send(servicesData);
// }

async function create(request, response) {
  // console.log('request body 🍕', request.body)
  // console.log('request user 🥩', request.user)

  const servicesObject = request.body;
  servicesObject.freelancer = request.user.dataValues.id
  const servicesData = await data.services.create(servicesObject);
  console.log('SERVICES DATA 🥐', servicesData)

  response.status(200).send({ success: servicesData, message: servicesData ? 'Created!' : 'Error Creating!' });
}

async function getAll(request, response) {
  console.log('got here!')
  // const allServices = await data.services.findAll({
  //   order: [
  //     // Will escape title and validate DESC against a list of valid direction parameters
  //     ['id', 'ASC'],]
  // });

  // const averageRatings = await ratings.findAll({
  //   where: { service_id: servicesId },
  //   attributes: [
  //     [Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating'],
  //   ],
  // })
  // console.log(averageRatings, 'average ratings')

  const allServices = await db.query(`
    SELECT s.*, AVG(r.rating) as "averageRating", COUNT(r.rating) as "totalRatings"
    FROM "Services" AS s
    LEFT JOIN "Ratings" as r
    ON r.service_id = s.id
    GROUP BY s.id;
  `,
    { type: QueryTypes.SELECT })

  response.status(200).send(allServices)
}

async function getOne(request, response) {
  const servicesId = request.params.servicesId;
  const singleServices = await db.query(`
    SELECT s.*, AVG(r.rating) as "averageRating", COUNT(r.rating) as "totalRatings"
    FROM "Services" AS s
    LEFT JOIN "Ratings" as r
    ON r.service_id = s.id
    WHERE s.id = ?
    GROUP BY s.id;
  `, {
    replacements: [servicesId],
  })

  console.log('single service is: ', singleServices[0][0])
  response.status(200).send(singleServices[0][0]);
}

// async function getOne(request, response) {
//   const servicesId = request.params.servicesId;
//   const singleServices = await data.services.findOne({
//     where: {
//       id: servicesId,
//     }
//   });

//   response.status(200).send(singleServices);
// }


async function update(request, response) {
  try {
    const servicesId = request.params.servicesId;
    const servicesObject = request.body;
    // console.log('🎰 services object', servicesObject)
    const servicesData = await data.services.findOne({ where: { id: servicesId } });
    // console.log('services data', servicesData)
    if (!servicesData) {
      throw 'could not find service'
    }
    // const res = await data.services.update(servicesObject, { where: { id: servicesId } });
    const res = await servicesData.update(servicesObject, { where: { id: servicesId } });

    //TODO: if res === [0], send an ERROR, since it is currently sending as a success because [0] is truthy
    response.status(200).send({ success: res, message: res ? 'Updated!' : 'Error Updating!' });

  } catch (error) {
    console.log(error)
    response.status(500).send(error);
  }
}


async function remove(request, response) {

  const servicesId = request.params.servicesId;
  const res = await data.services.destroy({ where: { id: servicesId } });
  // console.log('RES IS', res)

  response.status(200).send({ success: res, message: res ? 'Deleted!' : 'Error Deleting!' });
}

module.exports = router;
