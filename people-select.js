var Backbone = require("modules-common/backbone/backbone.js"),
	_ = require("modules-common/underscore/underscore.js"),
	$ = require("modules-common/jquery/jquery.js");

var View = Backbone.View.extend({
	initialize: function(){
		this.render();
		this.initEvent();
	},

	peopleTemplate: __inline("people-item.tmpl"),

	render: function(){
		this.$el.html(__inline("people-select.html"));

		this.$group = this.$el.find(".JS-group");
		this.$groupList = this.$el.find(".JS-groupList");
		this.$department = this.$el.find(".JS-department");
		this.$departmentList = this.$el.find(".JS-departmentList");
		this.$people = this.$el.find(".JS-people");
		this.$peopleList = this.$el.find(".JS-peopelList");
		this.$selectList = this.$el.find(".JS-selectList");
		this.$search = this.$el.find(".JS-search");

		this.loadData();
	},

	loadData: function(){
		var that = this;
		global.data.groupList.each( function(model){
			var obj = model.toJSON();
			obj.type = global.destType.group;
			that.$groupList.append(that.peopleTemplate(obj));
		});
		global.data.peopleList.each( function( model ){
			var obj = model.toJSON();
			obj.type = global.destType.member;
			that.$peopleList.append(that.peopleTemplate(obj));
		});
		global.data.departmentList.each( function( model ){
			var obj = model.toJSON();
			obj.type = global.destType.department;
			that.$departmentList.append(that.peopleTemplate(obj));
		});
	},

	initEvent: function(){
		var that = this;

		this.$group.on("click", function(){
			var $this = $( this );
			if ( $this.hasClass("opened") ) {
				that.closeGroup();
			} else {
				that.openGroup();
			}
		});

		this.$department.on("click", function(){
			var $this = $( this );
			if ( $this.hasClass("opened") ) {
				that.closeDepartment();
			} else {
				that.openDepartment();
			}
		});

		this.$people.on("click", function(){
			var $this = $( this );
			if ( $this.hasClass("opened") ) {
				that.closePeople();
			} else {
				that.openPeople();
			}
		});

		this.initSelectEvent();
		this.initSearchEvent();
	},

	initSelectEvent: function(){
		var that = this;
		function handle(){
			var $this = $(this),
				obj = $this.data();
			if ( $this.hasClass("selected") ) {
				that.remove(obj);
			} else {
				that.add(obj);
			}
		}
		this.$departmentList.on("click", "li", handle);
		this.$peopleList.on("click", "li", handle);
		this.$groupList.on("click", "li", handle);

		this.$selectList.on("click", ".JS-icon", function(){
			var obj = $(this).parent().data();
			that.remove(obj);
		});
	},

	initSearchEvent: function(){
		var that = this;
		var inputHandle = _.throttle(function(){
			var value = that.$search.val();
			if ( value === "" ) {
				that.$group.show();
				that.$department.show();
				that.$people.show();
				that.closeGroup();
				that.closeDepartment();
				that.openPeople();

				function show(){
					$(this).show();
				}
				that.$groupList.find("li").each(show);
				that.$peopleList.find("li").each(show);
				that.$departmentList.find("li").each(show);
			} else {
				that.openGroup();
				that.openDepartment();
				that.openPeople();
				that.$group.hide();
				that.$department.hide();
				that.$people.hide();

				function filter(){
					var $this = $( this ),
						name = $this.data("name");

					if ( name.indexOf(value) >= 0 ) {
						$this.show();
					} else {
						$this.hide();
					}
				}

				that.$groupList.find("li").each(filter);
				that.$peopleList.find("li").each(filter);
				that.$departmentList.find("li").each(filter);
			}
		}, 500);
		this.$search.on("input", inputHandle);
	},

	openGroup: function(){
		this.$group.addClass("opened");
		this.$groupList.show();
	},

	closeGroup: function(){
		this.$group.removeClass("opened");
		this.$groupList.hide();
	},

	openDepartment: function(){
		this.$department.addClass("opened");
		this.$departmentList.show();
	},

	closeDepartment: function(){
		this.$department.removeClass("opened");
		this.$departmentList.hide();
	},

	openPeople: function(){
		this.$people.addClass("opened");
		this.$peopleList.show();
	},

	closePeople: function(){
		this.$people.removeClass("opened");
		this.$peopleList.hide();
	},

	add: function( obj ){
		if ( obj.type === global.destType.member ) {
			this.$peopleList.find("li[data-id="+obj.id+"]").addClass("selected");
		} else if ( obj.type === global.destType.group ) {
			this.$groupList.find("li[data-id="+obj.id+"]").addClass("selected");
		} else if ( obj.type === global.destType.department ){
			this.$departmentList.find("li[data-id="+obj.id+"]").addClass("selected");
		}
		this.$selectList.append(this.peopleTemplate(obj));
	},

	remove: function( obj ){
		if ( obj.type === global.destType.member ) {
			this.$peopleList.find("li[data-id="+obj.id+"]").removeClass("selected");
		} else if ( obj.type === global.destType.group ) {
			this.$groupList.find("li[data-id="+obj.id+"]").removeClass("selected");
		} else if ( obj.type === global.destType.department ){
			this.$departmentList.find("li[data-id="+obj.id+"]").removeClass("selected");
		}
		this.$selectList.find("li[data-id="+obj.id+"]").remove();
	},

	show: function(){
		this.$el.show();
		this.$mask.show();
	},

	hide: function(){
		this.$el.hide();
		this.$mask.hide();
	},

	get: function(){
		var arr = [];
		this.$selectList.find("li").each( function(){
			var $this = $( this ),
				id = $this.data("id"),
				type = $this.data("type");
			arr.push({
				id:id,
				type:type
			});
		});
		return arr;
	},

	clear: function(){
		this.$peopleList.find("li").removeClass("selected");
		this.$groupList.find("li").removeClass("selected");
		this.$departmentList.find("li").removeClass("selected");
		this.$selectList.html("");
		this.closeGroup();
		this.closeDepartment();
		this.openPeople();
		this.$search.val("");
	},

	attributes:{
		class:"people-select"
	}
});

module.exports = View;