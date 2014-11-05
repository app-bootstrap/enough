(function(global, undefined) {
  'use strict';

  global.Model = Enough.Klass({
    constructor: function() {
      this.set(this.serialize());
    },
    serialize: function() {
      var res = global.localStorage['enough-todo'];
      return res ? JSON.parse(res) : {};
    },
    store: function() {
      global.localStorage['enough-todo'] = JSON.stringify(this.getAll());
    },
    getLeft: function() {
      return this.filter(function(item) {
        return item.completed === false;
      });
    },
    getComplete: function() {
      return this.filter(function(item) {
        return item.completed === true;
      });
    },
    getStates: function(state) {
      var that = this;
      state = state || 'all';
      var states = {
        all: function() {
          return that.getAllAsArray();
        },
        active: function() {
          return that.getLeft();
        },
        completed: function() {
          return that.getComplete();
        }
      };
      return states[state]();
    }
  });
})(this);
