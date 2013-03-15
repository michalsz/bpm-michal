$('#product').on('pageshow', function(event) {
	BPApp.Product.start();
});

BPApp.Product = {
	start: function(){
		this.getProduct(localStorage.getItem("product_id"));
		this.bindEvents();
	},

	getProduct: function (product_id) {
		var self = this;
		var auth_key = localStorage.getItem("auth_key");
		
		this.clearProductData();

		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.Towar',
			data: {'TowId': product_id, 'AuthKey': auth_key},
			type: 'GET',
            cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(item){              
				$('#product_name').html(item.tow_nazwa);
				$('#product_image').append('<img src="' + item.tow_image + '"/>');
				$('#product_details').html(item.tow_opis);
				$('#productId').attr('value', product_id);
				$('#product_price_netto').html(item.cena_n)
				$('#product_price_brutto').html(item.cena_b);
				$('#count').html(item.tow_stan_mag);
				self.showAddToCart();
				localStorage.setItem("subcategory", item.kt_id);
          	}
    	});
	},

	clearProductData: function(){
		$('#product_name').html('');
		$('#product_image').html('');
		$('#product_details').html('');
		$('#productId').html('');
		$('#product_price_netto').html('');
		$('#product_price_brutto').html('');
		$('#count').html('');
	},

	showAddToCart: function(){
		var authorized = localStorage.getItem("authorized");
		if (authorized) {
			$('#addToCart').show();
			$('#productCount').show();
		};
	},

	bindEvents: function(){
		var authorized = localStorage.getItem("authorized");
		if (authorized) {
			this.addToCartEventBind();
			console.log('addToCartEventBind');			
		} else {
			this.notAuthorisedEventBind();			
			console.log('notAuthorisedEventBind');
		};		

	},

	addToCartEventBind: function(){
		$('#addToCart').on('tap', function(event) {
			var productId = $('#productId').val(); 
			var productCount = $('#productCount').val();
			var productName = $('#productName_' + productId).html();
			BPApp.Cart.addProduct(productName, productId, productCount);
		})
	},
	
	notAuthorisedEventBind: function(){
		$('#addToCart').on('tap', function(event) {
				alert('Aby dodać produkt do koszyka musisz być naszym klientem. Zaloguj się, bądź skontaktuj z naszą infolinią.');
		})
	}
}
