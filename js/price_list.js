$('#priceListPage').on('pageshow', function(event){
	$('#productsPriceList').html('<h2 class="loadingmsg">Ładowanie...</h2>');		
	BPApp.ProductList.start();
});

BPApp.ProductList = {
	start: function(){
		this.getProductPriceList();
		this.onButtonClick();
	},

	getProductPriceList: function(){
		var auth_key = localStorage.getItem("auth_key");
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.TowaryWCenniku',
			data: {'AuthKey': auth_key},
			type: 'GET',
           	cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){              
				$('#productsPriceList').html('');
        		$.each(data.towary, function(i, item){
					BPApp.ProductList.getProductDetails(item.tow_id, 'productsPriceList');
				});
				BPApp.ProductList.onButtonClick();
				if(data.towary.length == 0){
						alert('Twój cennik nie został ustawiony');
					}
            	},
            	error: function(){
        			alert('error');
        	}
    	});
	},

	getProductDetails: function(product_id, element_id){
		var self = this;		
		var auth_key = localStorage.getItem("auth_key");
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.Towar',
			data: {'TowId': parseInt(product_id), 'AuthKey': auth_key},
			type: 'GET',
            cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(item){       
          		$('#' + element_id).append('<li><a data-transition="slide" class="bpm-price-btn" data-productid="' + item.tow_id + '" href="#product">' + item.tow_nazwa + ' <span class="right">' +  item.cena_n +' zł</span></a></li>');
          		$('#productsPriceList').listview('refresh');
				self.onButtonClick();          		       		
          	},
          	error: function(){
          		alert('error');
          	}
    	});    	
	},

	onButtonClick: function(){
		$('.bpm-price-btn').on('tap', function(event) {		
			var id = $(event.target).attr('data-productid');
			localStorage.setItem("product_id", id);
		});
	}
}
