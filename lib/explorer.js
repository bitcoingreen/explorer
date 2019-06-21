var request = require("request-promise-native"),
  settings = require("./settings"),
  Address = require("../models/address"),
  redis = require("./redis");

var base_url = "http://127.0.0.1:" + settings.port + "/api/";

// returns coinbase total sent as current coin supply
function coinbase_supply(cb) {
  redis.get("supply").then(res => {
    if (res === null) {
      Address.findOne({ a_id: "coinbase" }, function(err, address) {
        if (address) {
          redis.set("supply", address.sent);
          return cb(address.sent);
        } else {
          return cb();
        }
      });
      return;
    }
    cb(res);
  });
}

module.exports = {
  convert_to_satoshi: function(amount, cb) {
    // fix to 8dp & convert to string
    var fixed = amount.toFixed(8).toString();
    // remove decimal (.) and return integer
    return cb(parseInt(fixed.replace(".", "")));
  },

  get_hashrate_process(body, cb) {
    if (body == "There was an error. Check your console.") return cb("-");

    //getmininginfo returned in mhash
    if (body.networkhashps) {
      if (settings.nethash_units == "K") {
        return cb((body.networkhashps * 1000).toFixed(4));
      } else if (settings.nethash_units == "G") {
        return cb((body.networkhashps / 1000).toFixed(4));
      } else if (settings.nethash_units == "H") {
        return cb((body.networkhashps * 1000000).toFixed(4));
      } else if (settings.nethash_units == "T") {
        return cb((body.networkhashps / 1000000).toFixed(4));
      } else if (settings.nethash_units == "P") {
        return cb((body.networkhashps / 1000000000).toFixed(4));
      } else {
        return cb(body.networkhashps.toFixed(4));
      }
    } else {
      // getnetworkhashps
      if (settings.nethash_units == "K") {
        return cb((body / 1000).toFixed(4));
      } else if (settings.nethash_units == "M") {
        return cb((body / 1000000).toFixed(4));
      } else if (settings.nethash_units == "G") {
        return cb((body / 1000000000).toFixed(4));
      } else if (settings.nethash_units == "T") {
        return cb((body / 1000000000000).toFixed(4));
      } else if (settings.nethash_units == "P") {
        return cb((body / 1000000000000000).toFixed(4));
      } else {
        return cb(body.toFixed(4));
      }
    }
  },

  get_hashrate: function(cb) {
    if (settings.index.show_hashrate == false) return cb("-");

    redis.get("hashrate").then(res => {
      if (res === null) {
        let uri =
          base_url +
          (settings.nethash == "netmhashps"
            ? "getmininginfo"
            : "getnetworkhashps");
        request({ uri: uri, json: true })
          .then(res => {
            redis.set("hashrate", res);
            this.get_hashrate_process(res, cb);
          })
          .catch(err => {
            cb("-");
          });

        return;
      }

      this.get_hashrate_process(res, cb);
    });
  },

  get_difficulty: function(cb) {
    redis.get("difficulty").then(res => {
      if (res === null) {
        var uri = base_url + "getdifficulty";
        request({ uri: uri, json: true }).then(res => {
          redis.set("difficulty", res);
          cb(res);
        });
        return;
      }

      cb(res);
    });
  },

  get_connectioncount: function(cb) {
    redis.get("connectioncount").then(res => {
      if (res === null) {
        var uri = base_url + "getconnectioncount";
        request({ uri: uri, json: true }).then(res => {
          redis.set("connectioncount", res);
          cb(res);
        });
        return;
      }

      cb(res);
    });
  },

  get_blockcount: function(cb) {
    redis.get("blockcount").then(res => {
      if (res === null) {
        var uri = base_url + "getblockcount";
        request({ uri: uri, json: true }).then(res => {
          redis.set("blockcount", res);
          cb(res);
        });
        return;
      }
      cb(res);
    });
  },

  get_blockhash: function(height, cb) {
    redis.get("bhe_" + height).then(res => {
      if (res === null) {
        var uri = base_url + "getblockhash?height=" + height;
        request({ uri: uri, json: true }).then(res => {
          redis.set("bhe_" + height, res);
          cb(res);
        });
        return;
      }
      cb(res);
    });
  },

  get_block: function(hash, cb) {
    redis.get("bha_" + hash).then(res => {
      if (res === null) {
        var uri = base_url + "getblock?hash=" + hash;
        request({ uri: uri, json: true }).then(res => {
          redis.set("bha_" + hash, res);
          cb(res);
        });
        return;
      }
      cb(res);
    });
  },

  get_rawtransaction: function(hash, cb) {
    redis.get("tx_" + hash).then(res => {
      if (res === null) {
        var uri = base_url + "getrawtransaction?txid=" + hash + "&decrypt=1";
        request({ uri: uri, json: true }).then(res => {
          redis.set("tx_" + hash, res);
          cb(res);
        });
        return;
      }
      cb(res);
    });
  },

  get_maxmoney: function(cb) {
    redis.get("maxmoney").then(res => {
      if (res === null) {
        var uri = base_url + "getmaxmoney";
        request({ uri: uri, json: true }).then(res => {
          redis.set("maxmoney", res);
          cb(res);
        });
        return;
      }
      cb(res);
    });
  },

  get_maxvote: function(cb) {
    redis.get("maxvote").then(res => {
      if (res === null) {
        var uri = base_url + "getmaxvote";
        request({ uri: uri, json: true }).then(res => {
          redis.set("maxvote", res);
          cb(res);
        });
        return;
      }
      cb(res);
    });
  },

  get_vote: function(cb) {
    redis.get("vote").then(res => {
      if (res === null) {
        var uri = base_url + "getvote";
        request({ uri: uri, json: true }).then(res => {
          redis.set("vote", res);
          cb(res);
        });
        return;
      }
      cb(res);
    });
  },

  get_phase: function(cb) {
    redis.get("phase").then(res => {
      if (res === null) {
        var uri = base_url + "getphase";
        request({ uri: uri, json: true }).then(res => {
          redis.set("phase", res);
          cb(res);
        });
        return;
      }
      cb(res);
    });
  },

  get_reward: function(cb) {
    redis.get("reward").then(res => {
      if (res === null) {
        var uri = base_url + "getreward";
        request({ uri: uri, json: true }).then(res => {
          redis.set("reward", res);
          cb(res);
        });
        return;
      }
      cb(res);
    });
  },

  get_estnext: function(cb) {
    redis.get("nextrewardestimate").then(res => {
      if (res === null) {
        var uri = base_url + "getnextrewardestimate";
        request({ uri: uri, json: true }).then(res => {
          redis.set("nextrewardestimate", res);
          cb(res);
        });
        return;
      }
      cb(res);
    });
  },

  get_nextin: function(cb) {
    redis.get("nextrewardwhenstr").then(res => {
      if (res === null) {
        var uri = base_url + "getnextrewardwhenstr";
        request({ uri: uri, json: true }).then(res => {
          redis.set("nextrewardwhenstr", res);
          cb(res);
        });
        return;
      }
      cb(res);
    });
  },

  // synchonous loop used to interate through an array,
  // avoid use unless absolutely neccessary
  syncLoop: function(iterations, process, exit) {
    var index = 0,
      done = false,
      shouldExit = false;
    var loop = {
      next: function() {
        if (done) {
          if (shouldExit && exit) {
            exit(); // Exit if we're done
          }
          return; // Stop the loop if we're done
        }
        // If we're not finished
        if (index < iterations) {
          index++; // Increment our index
          if (index % 100 === 0) {
            //clear stack
            setTimeout(function() {
              process(loop); // Run our process, pass in the loop
            }, 1);
          } else {
            process(loop); // Run our process, pass in the loop
          }
          // Otherwise we're done
        } else {
          done = true; // Make sure we say we're done
          if (exit) exit(); // Call the callback on exit
        }
      },
      iteration: function() {
        return index - 1; // Return the loop number we're on
      },
      break: function(end) {
        done = true; // End the loop
        shouldExit = end; // Passing end as true means we still call the exit callback
      }
    };
    loop.next();
    return loop;
  },

  balance_supply: function(cb) {
    redis.get("supply").then(res => {
      if (res === null) {
        Address.find({}, "balance")
          .where("balance")
          .gt(0)
          .exec(function(err, docs) {
            var count = 0;
            module.exports.syncLoop(
              docs.length,
              function(loop) {
                var i = loop.iteration();
                count = count + docs[i].balance;
                loop.next();
              },
              function() {
                redis.set("supply", count);
                cb(count);
              }
            );
          });
        return;
      }
      cb(res);
    });
  },

  get_supply: function(cb) {
    if (
      settings.supply == "HEAVY" ||
      settings.supply == "GETINFO" ||
      settings.supply == "TXOUTSET"
    ) {
      let url_path = "";
      switch (settings.supply) {
        case "HEAVY":
          url_path = "getsupply";
          break;
        case "GETINFO":
          url_path = "getinfo";
          break;
        case "TXOUTSET":
          url_path = "gettxoutsetinfo";
          break;
      }
      redis.get("supply").then(res => {
        if (res === null) {
          var uri = base_url + url_path;
          request({ uri: uri, json: true }).then(res => {
            if (settings.supply == "GETINFO") res = res.moneysupply;
            if (settings.supply == "TXOUTSET") res = res.total_amount;
            redis.set("supply", res);
            cb(res);
          });
          return;
        }
        cb(res);
      });
    } else if (settings.supply == "BALANCES") {
      module.exports.balance_supply(function(supply) {
        return cb(supply / 100000000);
      });
    } else {
      coinbase_supply(function(supply) {
        return cb(supply / 100000000);
      });
    }
  },

  is_unique: function(array, object, cb) {
    var unique = true;
    var index = null;
    module.exports.syncLoop(
      array.length,
      function(loop) {
        var i = loop.iteration();
        if (array[i].addresses == object) {
          unique = false;
          index = i;
          loop.break(true);
          loop.next();
        } else {
          loop.next();
        }
      },
      function() {
        return cb(unique, index);
      }
    );
  },

  calculate_total: function(vout, cb) {
    var total = 0;
    module.exports.syncLoop(
      vout.length,
      function(loop) {
        var i = loop.iteration();
        //module.exports.convert_to_satoshi(parseFloat(vout[i].amount), function(amount_sat){
        total = total + vout[i].amount;
        loop.next();
        //});
      },
      function() {
        return cb(total);
      }
    );
  },

  prepare_vout: function(vout, txid, vin, cb) {
    var arr_vout = [];
    var arr_vin = [];
    arr_vin = vin;
    module.exports.syncLoop(
      vout.length,
      function(loop) {
        var i = loop.iteration();
        // make sure vout has an address
        if (
          vout[i].scriptPubKey.type != "nonstandard" &&
          vout[i].scriptPubKey.type != "nulldata"
        ) {
          // check if vout address is unique, if so add it array, if not add its amount to existing index
          //console.log('vout:' + i + ':' + txid);
          module.exports.is_unique(
            arr_vout,
            vout[i].scriptPubKey.addresses[0],
            function(unique, index) {
              if (unique == true) {
                // unique vout
                module.exports.convert_to_satoshi(
                  parseFloat(vout[i].value),
                  function(amount_sat) {
                    arr_vout.push({
                      addresses: vout[i].scriptPubKey.addresses[0],
                      amount: amount_sat
                    });
                    loop.next();
                  }
                );
              } else {
                // already exists
                module.exports.convert_to_satoshi(
                  parseFloat(vout[i].value),
                  function(amount_sat) {
                    arr_vout[index].amount =
                      arr_vout[index].amount + amount_sat;
                    loop.next();
                  }
                );
              }
            }
          );
        } else {
          // no address, move to next vout
          loop.next();
        }
      },
      function() {
        if (vout[0].scriptPubKey.type == "nonstandard") {
          if (arr_vin.length > 0 && arr_vout.length > 0) {
            if (arr_vin[0].addresses == arr_vout[0].addresses) {
              //PoS
              arr_vout[0].amount = arr_vout[0].amount - arr_vin[0].amount;
              arr_vin.shift();
              return cb(arr_vout, arr_vin);
            } else {
              return cb(arr_vout, arr_vin);
            }
          } else {
            return cb(arr_vout, arr_vin);
          }
        } else {
          return cb(arr_vout, arr_vin);
        }
      }
    );
  },

  get_input_addresses: function(input, vout, cb) {
    var addresses = [];
    if (input.coinbase) {
      var amount = 0;
      module.exports.syncLoop(
        vout.length,
        function(loop) {
          var i = loop.iteration();
          amount = amount + parseFloat(vout[i].value);
          loop.next();
        },
        function() {
          addresses.push({ hash: "coinbase", amount: amount });
          return cb(addresses);
        }
      );
    } else {
      module.exports.get_rawtransaction(input.txid, function(tx) {
        if (tx) {
          module.exports.syncLoop(
            tx.vout.length,
            function(loop) {
              var i = loop.iteration();
              if (tx.vout[i].n == input.vout) {
                //module.exports.convert_to_satoshi(parseFloat(tx.vout[i].value), function(amount_sat){
                if (tx.vout[i].scriptPubKey.addresses) {
                  addresses.push({
                    hash: tx.vout[i].scriptPubKey.addresses[0],
                    amount: tx.vout[i].value
                  });
                }
                loop.break(true);
                loop.next();
                //});
              } else {
                loop.next();
              }
            },
            function() {
              return cb(addresses);
            }
          );
        } else {
          return cb();
        }
      });
    }
  },

  prepare_vin: function(tx, cb) {
    var arr_vin = [];
    module.exports.syncLoop(
      tx.vin.length,
      function(loop) {
        var i = loop.iteration();
        module.exports.get_input_addresses(tx.vin[i], tx.vout, function(
          addresses
        ) {
          if (addresses && addresses.length) {
            //console.log('vin');
            module.exports.is_unique(arr_vin, addresses[0].hash, function(
              unique,
              index
            ) {
              if (unique == true) {
                module.exports.convert_to_satoshi(
                  parseFloat(addresses[0].amount),
                  function(amount_sat) {
                    arr_vin.push({
                      addresses: addresses[0].hash,
                      amount: amount_sat
                    });
                    loop.next();
                  }
                );
              } else {
                module.exports.convert_to_satoshi(
                  parseFloat(addresses[0].amount),
                  function(amount_sat) {
                    arr_vin[index].amount = arr_vin[index].amount + amount_sat;
                    loop.next();
                  }
                );
              }
            });
          } else {
            loop.next();
          }
        });
      },
      function() {
        return cb(arr_vin);
      }
    );
  },

  get_masternodes: function(cb) {
    redis.get("masternodelist").then(res => {
      if (res === null) {
        var uri = base_url + "masternode?action=list";
        request({ uri: uri, json: true }).then(res => {
          redis.set("masternodelist", res);
          cb(res);
        });
        return;
      }
      cb(res);
    });
  }
};
