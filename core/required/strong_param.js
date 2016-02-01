module.exports = (function() {

  'use strict';

  const utilities = require('./utilities.js');

  /**
  * Used to filter parameters from HTTP query string or body data
  * @class
  */
  class StrongParam {

    /**
    * @param {props} object Properties
    */
    constructor(props) {

      Object.keys(props).forEach(key => this[key] = props[key]);

    }

    __filter__(fromObject, args, except) {

      let keys = args
        .filter(arg => typeof arg === 'string')
        .reduce((o, key) => {
          o[key] = true;
          return o;
        }, {});

      let objKeys = args
        .filter(arg => typeof arg === 'object' && arg !== null)
        .reduce((o, obj) => {
          Object.keys(obj).forEach(key => o[key] = obj[key]);
          return o;
        }, {});

      return Object.keys(fromObject).reduce((o, key) => {

        if (objKeys[key]) {
          o[key] = this.__filter__(fromObject[key], objKeys[key], except);
        } else if (!!except ^ !!keys[key]) {
          o[key] = fromObject[key];
        }

        return o;

      }, {});

    }

    permit() {

      return new StrongParam(this.__filter__(this, [].slice.call(arguments), false));

    }

    except() {

      return new StrongParam(this.__filter__(this, [].slice.call(arguments), true));

    }

  };


  return StrongParam;

})();
