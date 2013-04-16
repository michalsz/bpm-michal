var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "list"
    },

    initialize: function(){

    },

    list: function(){
    	var categories = new CategoryCollection();
    	//categories.fetch({data: $.param({ 'KtId': '', 'AuthKey': ''}), success: function(){
            //$("#content").html(new CategoryListView({model: categories}).el);
        //	}
    	//});
    }
});

app = new AppRouter();
Backbone.history.start();