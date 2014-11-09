/* ================================================================
 * enough by xdf(xudafeng[at]126.com)
 *
 * first created at : Mon Nov 03 2014 19:45:18 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright 2013 xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

var enough = require('..');

describe('/lib/enough.js', function() {
  describe('create Model and View class', function() {
    var Model = enough.Klass({
      constructor: function() {
        this.property = 'property';
      },
      method: function() {
        return 'method';
      }
    });
    var subModel = Model.Klass({
      constructor: function() {
        this.foo = 'foo';
      },
      bar: function() {
        return 'bar';
      }
    });
    var instance = new Model();
    var sinstance = new subModel();
    it('should have constructor property', function() {
      instance.should.be.an.instanceof(Model);
      instance.should.have.property('property', 'property');
    });
    it('should exec public method', function() {
      instance.method().should.be.equal('method');
    });
    it('should inherit from parent', function() {
      sinstance.should.be.an.instanceof(Model);
      sinstance.should.be.an.instanceof(subModel);
      sinstance.should.have.property('property', 'property');
      sinstance.should.have.property('foo', 'foo');
      sinstance.bar().should.be.equal('bar');
    });
  });
  describe('augment and entend', function() {
    var Model = enough.Klass({
      constructor: function() {
        this.property = 'property';
      },
      method: function() {
        return 'method';
      }
    });
    Model.augment({
      bar: function() {
        return 'bar';
      }
    });
    var instance = new Model();
    instance.extend({
      foo: function() {
        return 'foo';
      }
    });
    it('should have extend method and property', function() {
      instance.foo().should.be.equal('foo');
    });
    it('should have augment method and property', function() {
      (!Model.bar).should.be.ok;
      instance.bar().should.be.ok;
    });
  });
  describe('event system and data bind', function() {
    var Model = enough.Klass({
      constructor: function() {
        this.property = 'property';
      }
    });
    var instance = new Model();
    it('should be ok', function() {
      instance.on('foo', function(c) {
        c.should.be.equal('bar');
      });
      instance.emit('foo', 'bar');
      instance.on('change:value', function(v) {
        v.should.be.equal('foo');
      })
      instance.set('value', 'foo');
      instance.get('value').should.be.equal('foo');
    });
  });
});
