$('#categories').on('pageshow', function(){
	BPApp.Categories.getCategories();
});

BPApp.Categories = {

	getCategories: function(){
		var self = this;
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.Kategorie',
			data: {'KtId': '', 'AuthKey': ''},
			type: 'GET',
            cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){         
        		$('#categoriesList').html('');
        		$.each(data.kategorie, function(i, item){
					$('#categoriesList').append('<li><a data-transition="slide" class="bpm-cat-button" data-cat="'+item.kt_id+'" href="#subcategories">' + item.kt_nazwa + '</a></li>');
				})
				$('#categoriesList').listview('refresh');

				self.bindEvents();
            },
            error: function(){
        		alert('error');
        	}
    	});
	},

	bindEvents: function(){
		$('.bpm-cat-button').on('tap', function(event) {
			var id = $(event.target).attr('data-cat');
			localStorage.setItem("category", id);
		});
	}
}
