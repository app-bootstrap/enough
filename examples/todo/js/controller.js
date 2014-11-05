(function(global, undefined) {
  'use strict';

  var Controller = Enough.Klass({
    constructor: function(Model, View) {
      this.model = new Model();
      this.view = new View();
      this.bind();
      this.init();
    },
    init: function() {
      this.set('state', this.view.getState());
    },
    bind: function() {
      var that = this;
      this.model.on('change', function() {
        that.updateView();
        that.model.store();
      });
      this.on('change', function() {
        that.updateView();
        that.view.setRoute(that.get('state'));
      });
      this.view.on({
        add: function(v) {
          var id = +new Date;
          that.model.set(id, {
            id: id,
            content: v,
            completed: false
          });
          that.view.clearInput();
        },
        remove: function(id) {
          that.model.remove(id);
        },
        edit: function(data) {
          if (data.content === '') {
            that.model.remove(data.id);
          } else {
            that.model.update(data.id, function(item) {
              item.content = data.content;
              return item;
            });
          }
        },
        editing: function(k) {
          that.view.editing(k);
        },
        completed: function(id) {
          that.model.update(id, function(v) {
            v.completed = true;
            return v;
          });
        },
        uncompleted: function(id) {
          that.model.update(id, function(v) {
            v.completed = false;
            return v;
          });
        },
        completedall: function(is) {
          that.model.update(function(item) {
            item.completed = is;
          });
        },
        clear: function() {
          that.model.remove(function(item) {
            return item.completed === true;
          });
        },
        state: function(state) {
          that.set('state', state);
        }
      });
    },
    updateView: function() {
      var state = this.get('state');
      var list = this.model.getStates(state);
      this.view.render(list);
      this.view.showLeft(this.model.getLeft().length);
      this.view.showClear(this.model.getComplete().length);
      this.view.showFooter(list.length, state !== 'all');
    }
  });

  new Controller(Model, View);

})(this);
