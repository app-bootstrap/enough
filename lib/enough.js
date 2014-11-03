/* ================================================================
 * enough by xdf(xudafeng[at]126.com)
 *
 * first created at : Mon Nov 03 2014 19:45:18 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright  xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

//this.enough = {};
//var exports = this.enough;

'use strict';

/**
 * util
 */
var _guid = 0;

var _ = {
  guid: function() {
    return _guid++;
  },
  create: function(o) {

    if (Object.create) {
      return Object.create(o);
    } else {
      var F = function() {};
      F.prototype = o;
      return new F();
    }
  },
  slice: Array.prototype.slice,
  extend: function() {
    var that = this;
    var args = this.slice.call(arguments);
    var r = args.shift();
    this.each(args, function(properties) {
      that.merge(r, properties);
    });
    return r;
  },
  inherit: function(sub, sup) {
    var swap = sub.prototype;
    sub.prototype = this.create(sup.prototype);

    for(var i in swap) {
      sub.prototype[i] = swap[i];
    }
    sub.prototype.constructor = sub;
    sub.sup = sup;
  },
  augment: function(r, s) {
    this.merge(r.prototype, s);
    return r;
  },
  proto: this.augment,
  merge: function(r, s) {
    this.each(s, function(v, k) {
      r[k] = v;
    });
    return r;
  },
  each: function(object, fn) {

    if(!object) return;

    for (var i in object) {
      if (object.hasOwnProperty(i)) {
        fn.call(this, object[i], i);
      }
    }
    return object;
  },
  trim: function(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }
};

exports._ = _;

/**
 * Class Factory
 */
function Klass(obj) {
  obj = obj || {};
  var _constructor = obj.hasOwnProperty('constructor') ? obj.constructor : function() {};
  var _superclass = obj.sup || function() {};
  var constructor = function() {

    if (!(this instanceof constructor)) {
      throw new Error('Please use keyword: new, when initial a class.');
    }

    this.guid = _.guid();

    // create namespace
    _dataHash[this.guid] = {};
    _eventHandleHash[this.guid] = {};

    // inherit from super class
    constructor.sup.apply(this, arguments);
    _constructor.apply(this, arguments);
  }

  _.inherit(constructor, _superclass);

  _.extend(constructor, {
    Klass: Klass,
    extend: _.extend,
    augment: _.augment
  });

  return constructor;
}

exports.Klass = Klass;


/**
 * data bind
 */

var _dataHash = {};

var _setAttribute = function(key, value) {
  _dataHash[this.id][key] = value;
}

var _removeAttribute = function(key) {

}

var _updateAttribute = function(key, value) {

}


var Data = {
  get: function() {
    console.log(arguments)
  },
  set: function(key, value) {

    if (typeof key === 'object') {
      for (var k in key) {
        _.setAttribute.call(this, k, key[k]);
      }
    } else {
      _.setAttribute.call(this, key, value);
    }
    return this;
  },
  update: function() {
  },
  has: function() {},
  remove: function(key) {
  },
  getAll: function() {},
  size: function() {},
  getAllAsArray: function() {}
};

/**
 * custom event
 */
var _eventHandleHash = {};

var _bindEvent = function() {

}

var _unbindEvent = function() {

}

var _triggerEvent = function() {

}

var Event = {
  on: function() {
  },
  detach: function() {
  },
  emit: function() {
  }
};

/* vim: set sw=2 ts=2 et tw=80 : */
