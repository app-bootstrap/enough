(function(global, undefined) {
  'use strict';

  var Model = Enough.Klass({
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

  var ENTER_KEY_KEYCODE = 13;
  var View = Enough.Klass({
    constructor: function() {
      this.bind();
      this.loadTemplates();
    },
    bind: function() {
      var that = this;
      $('#new-todo').on('keyup', function(e) {
        var v = $.trim($(e.target).val());
        if (e.which === ENTER_KEY_KEYCODE && v !== '') {
          that.emit('add', v);
          return false;
        }
      });
      $('#todo-list').on('click', '.destroy', function(e) {
        that.emit('remove', $(e.target).parents('li').data('id'));
      });
      $('#todo-list').on('click', 'input.toggle', function(e) {
        var type = $(e.target).is(':checked') ? 'completed' : 'uncompleted';
        that.emit(type, $(e.target).parents('li').data('id'));
      });
      $('#todo-list').on('dblclick', 'li', function(e) {
        that.emit('editing', $(e.target).closest('li').data('id'));
      });
      $('#todo-list').on('keyup focusout', 'input.edit', function(e) {
        if (e.type === 'keyup') {
          if (e.which === ENTER_KEY_KEYCODE) {
            e.preventDefault();
          } else {
            return false;
          }
        }
        var $li = $(e.target).closest('li');
        that.emit('edit', {
          id: $li.data('id'),
          content: $.trim($li.find('.edit').val())
        });
      });
      $('#clear-completed').on('click', function() {
        that.emit('clear');
      });
      $('#toggle-all').on('click', function(e) {
        var isChecked = $(e.target).is(':checked');
        that.emit('completedall', isChecked);
      });
      global.onhashchange = function() {
        that.emit('state', that.getState());
      }
    },
    getState: function() {
      return global.location.hash.replace('#/', '') || 'all';
    },
    render: function(list) {
      var html = this.template({
        todos: list
      });
      $('#todo-list').html(html);
    },
    loadTemplates : function() {
      this.template = grace.compile($('#grace-template').html());
    },
    hide: function() {
      $('#main, #footer').hide();
    },
    clearCompleted: function() {
    },
    clearInput: function() {
      $('#new-todo').val('');
    },
    editing: function(id) {
      var $item = $('#todo-list li[data-id=' + id + ']');
      $item.addClass('editing').find('input.edit').focus();
    },
    showLeft: function(num) {
      var word = (num === 1) ? 'item' : 'items';
      $('#todo-count').html('<strong>' + num + '</strong> ' + word + ' left');
      $("#toggle-all").get(0).checked = (num === 0);
    },
    showClear: function(num) {
      $('#clear-completed').toggle(num > 0);
      $('#clear-completed').html('Clear completed (' + num + ')');
    },
    showFooter: function(num, isCompleteState) {
      $('#footer')[num || isCompleteState? 'show' : 'hide']();
    },
		setRoute: function(route) {
			route = (route === 'all') ? '' : route;
			$('#filters a').removeClass('selected').filter('[href="#/' + route + '"]').addClass('selected');
		}
  });

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
