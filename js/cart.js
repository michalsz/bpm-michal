$('#cart').on('pageshow', function(){
	BPApp.Cart.start();
});

  BPApp.Cart = {
  	start: function(){
  		this.displayProductsFromCart();
  		this.displayDepartmentsSelect();
  		this.bindEvents();
  	},

	displayProductsFromCart: function(){
		var self = this;
		var cartId = this.getCartId();
		if(cartId){
			$.ajax({
				url: Config.serviceURL + 'BPK.pkg_json.PozycjeKoszyka',
				data: {'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key")},
				type: 'GET',
            	cache: false,
				dataType: 'jsonp',
				crossDomain: true,
				contentType: 'application/json; charset=utf-8',
				success: function(cart){   
					console.log('display products');
					$('#cartProducts').html('');
					console.log(cart);
					if(cart){
						$.each(cart.pozycje, function(i, item){
						$('#cartProducts').append('<li class="kontener" data-inset="true"><a href="#product" class="bpm-cart-prod" data-productid="' + item.tow_id + '">' + item.tow_nazwa + '</a><div data-role="controlgroup" data-type="horizontal" data-mini="true" class="kontrolki" ><span class="productcountlabel">sztuk:</span><span class="productcount">' +  item.pds_ilosc +'</span><a data-role="button" data-icon="arrow-u" data-iconpos="notext" data-wrapperels="span" class="bpm-cart-up" data-count="' +  item.pds_ilosc +'" data-pdsid="' + item.tow_id + '">Więcej</a><a data-role="button" data-icon="arrow-d" data-iconpos="notext" data-wrapperels="span" class="bpm-cart-down" data-count="' + item.pds_ilosc + '" data-pdsid="' + item.tow_id + '">Mniej</a><a data-role="button" data-icon="delete" data-iconpos="notext" data-wrapperels="span" class="bpm-cart-remove" data-pdsid="' + item.tow_id + '">Usuń</a></div></li>');
						})
						$('#cartProducts').listview('refresh');
						self.bindEvents();
						
						if(cart.pozycje.length > 0){
							$('#departmentsSelect').show();
						}
					}	
          		}
    		});
    	}
	},

	displayDepartmentsSelect: function(){
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.Oddzialy',
			data: {'OdbId': '', 'Stat': '', 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
        	cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){ 
				$('#departmentsSelect').html('<option>Wybierz oddział</option>');
				$.each(data.oddzialy, function(i, item){
					$('#departmentsSelect').append('<option value="' + item.kth_id +'">' +  item.dak_skrot + '</option>');
				})
				$('#departmentsSelect').selectmenu('refresh');
			}
		})
	},

	createCart: function(){
		var self = this;
		if(parseInt(localStorage.getItem('cartId') > 0)){
			return localStorage.getItem('cartId');
		}else{
			$.ajax({
				url: Config.serviceURL + 'BPK.pkg_json.DodajKoszyk',
				data: {'AuthKey': localStorage.getItem("auth_key")},
				type: 'GET',
            	cache: false,
				dataType: 'jsonp',
				crossDomain: true,
				contentType: 'application/json; charset=utf-8',
				success: function(cart){              
					console.log('cartId ' + cart["kosz_id"]);
					localStorage.setItem('cartId', cart['kosz_id']);
          		},
          		error: function(message){
					console.log('errr');
          			console.log(message);
          		}
    		});
		}
    	return localStorage.getItem('cartId');
	},

	getCartId: function(){
		var cartId = this.createCart();
		return cartId;
	},

	addProduct: function(name, product_id, count){
		var cartId = this.getCartId();
		var self = this;
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.DodajPozycjeKoszyk',
			data: {'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key"), 'TowId': product_id, 'Ilosc': count},
			type: 'GET',
            cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(message){              
				if(message.Komunikat == ''){
					self.updateProductCount();
					alert('Produkt został dodany');
				}
          	},
			error: function(message){
					console.log('errr');
          			console.log(message);
          		}
    	});
	},

	updateProductCount: function(){
		var cartId = this.getCartId();
		var productCount = 0;
		if(cartId){
			$.ajax({
				url: Config.serviceURL + 'BPK.pkg_json.PozycjeKoszyka',
				data: {'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key")},
				type: 'GET',
            	cache: true,
				dataType: 'jsonp',
				crossDomain: true,
				contentType: 'application/json; charset=utf-8',
				success: function(cart){   
					if(cart['pozycje']){
						productCount = cart['pozycje'].length;
						localStorage.setItem("productCount", productCount);
    					$('.cart-number').text(productCount);
					}	
          		}
    		});
    	}
	},

	removeProduct: function(event){
		console.log('remove');
		var pdsId =  $(event.target).attr('data-pdsid');
		var cartId = this.getCartId();
		var self = this;
		console.log('remove');
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.UsunPozycjeKoszyk',
			data: {'KoszId': cartId, 'PdsId': pdsId, 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
            cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(message){
				localStorage.setItem('productCount', parseInt(localStorage.getItem("productCount")) - 1);
				self.displayProductsFromCart();
				self.updateProductCount();
          	},
          	error: function(message){
					console.log('errr remove');
          			console.log(message);
          	}
    	});

	},

	increaseProduct: function(event, number){
		var pdsId =  $(event.target).attr('data-pdsid');
		var cartId = this.getCartId();
		var self = this;
		console.log('increase');
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.ZmienPozycjeKoszyk',
			data: {'KoszId': cartId, 'PdsId': pdsId, 'Ilosc': number, 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
            cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(message){              
				self.displayProductsFromCart();
				self.updateProductCount();
				console.log(message);
          	},
          	error: function(message){
					console.log('errr increase');
          			console.log(message);
          	}
    	});
	},

	setDepartment: function(department_id){
		var cartId = this.getCartId();
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.UstawOdbiorceDlaKoszyk',
			data: {'OdbId': department_id,  'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key"), 'Callback': ''},
			type: 'GET',
            cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(message){              
				console.log(message);
          	}
    	});
	},

	getDepartmentAdresses: function(department_id){
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.AdresyOddzialu',
			data: {'OdbId': department_id, 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
           	cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){
				$('#departmentsAdressesSelect').html('<option>Wybierz adres</option>');
				$.each(data.adresy, function(i, adress){
					$('#departmentsAdressesSelect').append('<option value="' + adress.dak_id +'">' +  adress.adr_opis + '</option>');
				})
				$('#departmentsAdressesSelect').selectmenu('refresh');
			}
		})
	},

	setAdress: function(adress_id){
		var cartId = this.getCartId();
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.UstawAdresDlaKoszyk',
			data: {'AdrId': adress_id,  'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key"), 'Callback': ''},
			type: 'GET',
            cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(message){              
				$('#costCenterSelect').show();
          	}
    	});
	},


	getCostCenters: function(adressId){
		var cartId = this.getCartId();
		var departamentId = $('#departmentsSelect').val();
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.CentraKosztowe',
			data: {'OdbId': departamentId ,'AdrId': adressId, 'Stat': 'A', 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
           	cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){           
				$('#costCenterSelect').html('<option>Wybierz centrum kosztowe</option>');
				$.each(data.centra, function(i, item){
					$('#costCenterSelect').append('<option value="' + item.ck_id +'">' +  item.ck_nazwa + '</option>');
				})
				$('#costCenterSelect').selectmenu('refresh');
			}    	
		});
	},

	submitOrder: function(){
		var cartId = this.getCartId();
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.ZamowKoszyk',
			data: {'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
            cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(message){              
				if(message.Zamowiony == 'T'){
					localStorage.setItem('cartId', null);
					$('#products').html('');
					alert(message.Komunikat);
				}
          	},
          	error: function(message){
          		console.log(message);	
          	}
    	});
	},

	onButtonClick: function(){
		$('.bpm-cart-prod').on('click', function(event) {
			var id = $(event.target).attr('data-productid');
			localStorage.setItem("product_id", id);
		});
	},

	bindEvents: function(){
		var self = this;

		//this.onButtonClick();

		// $('.bpm-cart-remove').on('click', function(event) {
		// 	self.removeProduct(event);
		// });
		
		// $('.bpm-cart-up').on('click', function(event) {
		// 	var count =  $(event.target).attr('data-count');
		// 	self.increaseProduct(event, parseInt(count) + 1);
		// });

		$('.bpm-cart-down').on('click', function(event) {
			var count = $(event.target).attr('data-count');
			alert(count);
			self.increaseProduct(event, (parseInt(count) -1) );
		});

		// $('#departmentsSelect').on('change', function(event){
		// 	var department_id = event.target.value;
		// 	self.setDepartment(department_id);
		// 	self.getDepartmentAdresses(department_id);
		// });

		// $('#departmentsAdressesSelect').on('change', function(event){
		// 	var adress_id = event.target.value;
		// 	self.setAdress(adress_id);
		// 	self.getCostCenters(adress_id);
		// });

		// $('#submitOrder').on('click', function(event){
		// 	self.submitOrder();
		// });
	}	
}