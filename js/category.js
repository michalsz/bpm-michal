$('#subcategories').on('pageshow', function(){
	$('#subcategoriesList').html('<h2 class="loadingmsg">Ładowanie...</h2>');
	BPApp.Category.start(); 
	
});


BPApp.Category = {
	start: function(){
		this.getSubCategories(localStorage.getItem("category"));
	},

	getSubCategories: function(category_id) {
		var self= this;
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.Kategorie',
			data: {'KtId': category_id, 'AuthKey': ''},
			type: 'GET',
            cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){
        		$('#subcategoriesList').html('');
        		$.each(data.kategorie, function(i, item){
					$('#subcategoriesList').append('<li><a data-transition="slide" class="bpm-subcategory-button" data-subcat="'+item.kt_id+'" href="#products">' + item.kt_nazwa + '</a></li>')
				})
				$('#subcategoriesList').listview('refresh');
				self.bindEvents();
            },
            error: function(){
        		alert('error');
        	}
    	});
	},

	bindEvents: function(){
		$('.bpm-subcategory-button').on('click', function(event) {
			var id = $(event.target).attr('data-subcat');
			localStorage.setItem("subcategory", id);
		});
	}
}
