'use strict';

const express = require('express');
const cors = require('cors');

const servicesRoutes = require('./routes/services.js')
const userRoutes = require('./routes/user.js');
const authRoutes = require('./routes/auth.js');
const ratingRoutes = require('./routes/rating.js');


const app = express();

app.use(cors());
app.use(express.json());

console.log('server file, we have arrived')

app.use((req, res, next) => {
  console.log(req.url, 'ROUTE!!')
  next()
})

app.use(servicesRoutes);
app.use(userRoutes);
app.use(authRoutes);
app.use(ratingRoutes);


// app.post('/user', (req, res) => {
//   res.send('got to post')
// });

module.exports = {
  app: app,
  start: (PORT) => {
    app.listen(PORT, () => console.log(`🚦 app is up and running on ${PORT} 🚦`));
  }
}
