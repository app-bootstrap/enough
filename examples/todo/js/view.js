(function(global, undefined) {
  'use strict';

  var ENTER_KEY_KEYCODE = 13;

  global.View = Enough.Klass({
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

})(this);
