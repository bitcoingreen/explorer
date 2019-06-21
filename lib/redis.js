const redis = require("redis");

module.exports = {
  instance: null,
  expire: 0,

  // initialize DB
  connect(params, cb) {
    const _ = this;
    _.expire = params.expire;
    return new Promise((resolve, reject) => {
      _.instance = redis.createClient({
        url: "redis://" + params.address,
        db: params.db
      });

      resolve();
    });
  },

  get(key) {
    const _ = this;
    return new Promise((resolve, reject) => {
      if (!_.instance) {
        resolve(null);
        return;
      }

      _.instance.get(key, (err, res) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(JSON.parse(res));
      });
    });
  },

  set(key, value) {
    const _ = this;
    return new Promise((resolve, reject) => {
      if (!_.instance) {
        resolve(null);
        return;
      }

      _.instance.set(
        key,
        value != null ? JSON.stringify(value) : null,
        "EX",
        _.expire,
        (err, res) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(res);
        }
      );
    });
  }
};
