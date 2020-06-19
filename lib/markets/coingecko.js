var request = require('request');

var base_url = 'https://api.coingecko.com/api/v3';

function get_summary(coin, exchange, cb) {
  var req_url = base_url + '/coins/markets?vs_currency=' + exchange + '&ids=' + coin;
  request({uri: req_url, json: true}, function (error, response, body) {
    if (error) {
      return cb(error, null);
    } else {
      if (body.length == 0)
        return cb(null, null);
      else
        return cb(null, {
          'last': body[0].current_price
        });
    }
  });
}

module.exports = {
  get_data: function(coin, exchange, cb) {
    var error = null;
    get_summary(coin, exchange, function(err, stats) {
      if (err) { error = err; }
      return cb(error, {stats: stats});
    });
  }
};
