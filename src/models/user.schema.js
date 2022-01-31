'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let SECRET = process.env.SECRET || 'secretstring';

module.exports = (sequelize, DataTypes) => {
  let model = sequelize.define('Users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'freelancer'),
      defaultValue: 'user',
    },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username }, SECRET);
      },
      set(tokenObj) {
        let token = jwt.sign(tokenObj, SECRET);
        return token;
      }
    },
    capabilities: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          user: ['read'],
          freelancer: ['read', 'create', 'update', 'delete']
        };
        return acl[this.role];
      }
    },
    // services: {
    //   type: DataTypes.ARRAY(DataTypes.STRING),
    // }
  });

  // encrypt our password before we save to your table
  model.beforeCreate(async (user) => {
    let hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });

  // take in strings and return a validUser if strings are authentic
  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) { return user; }
    throw new Error('Invalid User');
  }

  // take in a token and return a valid if token has valid signature
  model.authenticateBearer = async function (token) {
    try {
      const parsedToken = jwt.verify(token, SECRET);
      console.log('parsed token 🍊', parsedToken)
      const user = await this.findOne({ where: { username: parsedToken.username } })
      console.log('user ☔️', user)
      if (user) { return user; }
      throw new Error("User Not Found");
    } catch (e) {
      throw new Error(e.message)
    }
  }

  return model;
}
