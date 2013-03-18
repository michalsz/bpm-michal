$('#cart').on('pageshow', function(){
	BPApp.Cart.start();
});

  BPApp.Cart = {
  	start: function(){
  		this.displayProductsFromCart();
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
					$('#cartProducts').html('');
					if(cart){
						$.each(cart.pozycje, function(i, item){
							$('#cartProducts').append('<li class="kontener" data-inset="true"><a href="#product" class="bpm-cart-prod" data-productid="' + item.tow_id + '">' + item.tow_nazwa + '</a><div data-role="controlgroup" data-type="horizontal" data-mini="true" class="kontrolki" ><span class="productcountlabel">sztuk:</span><span class="productcount">' +  item.pds_ilosc +'</span><a data-role="button" data-icon="arrow-u" data-iconpos="notext" data-wrapperels="span" class="bpm-cart-up" data-count="' +  item.pds_ilosc +'" data-pdsid="' + item.pds_id + '">Więcej</a><a data-role="button" data-icon="arrow-d" data-iconpos="notext" data-wrapperels="span" class="bpm-cart-down" data-count="' + item.pds_ilosc + '" data-pdsid="' + item.pds_id + '">Mniej</a><a data-role="button" data-icon="delete" data-iconpos="notext" data-wrapperels="span" class="bpm-cart-remove" data-pdsid="' + item.pds_id + '">Usuń</a></div></li>').trigger('create'); 

						});
						$('#cartProducts').listview('refresh');
						
						self.bindEvents();

						if(cart.pozycje.length > 0){
							self.displayDepartmentsSelect();
							self.cartSummary();
							$('#bpm-cartselects').show();
							$('#submitOrder').show();
							$('#cartSummary').show();
							$('#emptyCartMsg').hide();
						}else{
							$('#bpm-cartselects').hide();
							$('#submitOrder').hide();
							$('#cartSummary').hide();							
							$('#emptyCartMsg').show();
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
				$('#departmentsSelect').show();
			}
		})
	},

	createCart: function(){
		var self = this;
		if(localStorage.getItem('cartId') != 'undefined' && localStorage.getItem('cartId') != null ){
			//console.log('get cart from local');
			return localStorage.getItem('cartId');
		}else{
			//console.log('get cart from server');
			$.ajax({
				url: Config.serviceURL + 'BPK.pkg_json.DodajKoszyk',
				data: {'AuthKey': localStorage.getItem("auth_key")},
				type: 'GET',
            	cache: false,
				dataType: 'jsonp',
				crossDomain: true,
				contentType: 'application/json; charset=utf-8',
				success: function(cart){              
					//console.log('cartId ' + cart["kosz_id"]);
					//console.log('dane ustawione ' + cart["dane_ustawione"]);
					localStorage.setItem('cartId', cart['kosz_id']);
          		},
          		error: function(message){
					//console.log('errr');
          			//console.log(message);
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
					
				}
				alert('Produkt został dodany');
				//BPApp.Product.bindEvents();
          	},
			error: function(message){
					//console.log('errr');
          			//console.log(message);
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
    					$('.cart-number').html(productCount);
					}	
          		}
    		});
    	}
	},

	removeProduct: function(event){
		var pdsId =  $(event.target).parents('a').attr('data-pdsid');
		var cartId = this.getCartId();
		var self = this;
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.UsunPozycjeKoszyk',
			data: {'KoszId': cartId, 'PdsId': pdsId, 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
            cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(message){
				self.displayProductsFromCart();
				self.updateProductCount();
          	},
          	error: function(message){
					//console.log('errr remove');
          			//console.log(message);
          	}
    	});

	},

	increaseProduct: function(event, number){
		var pdsId =  $(event.target).parents('a').attr('data-pdsid');
		var cartId = this.getCartId();
		var self = this;
		//console.log('KoszId' + cartId + 'PdsId' + pdsId + 'Ilosc' + number);
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.ZmienPozycjeKoszyk',
			data: {'KoszId': cartId, 'PdsId': pdsId, 'Ilosc': number, 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
            cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(message){   
				//console.log(message);           
				self.displayProductsFromCart();
				self.updateProductCount();
          	},
          	error: function(message){
					//console.log('errr increase');
          			//console.log(message);
          	}
    	});
	},

	setDepartment: function(department_id){
		var cartId = this.getCartId();
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.UstawOdbiorceDlaKoszyk',
			data: {'OdbId': department_id,  'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
            cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(message){              
				if(message.ustawione == 'T'){
					//alert('Ustawiłeś oddział');
				}
          	},
          	error: function(error){
          		//console.log(error);
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
			data: {'AdrId': adress_id,  'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
            cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(message){              
				if(message.ustawione == 'T'){
					//alert('Ustawiłeś adres');
					$('#costCenterSelect').show();
				}
          	},
          	error: function(error){
          		//console.log(error);
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

	setCostCenter: function(cost_center_id){
		var cartId = this.getCartId();
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.UstawCkDlaKoszyk',
			data: {'CkId': cost_center_id,  'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
            cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(message){              
				if(message.ustawione == 'T'){
					//alert('Ustawiłeś centrum kosztowe');
					$('#costCenterSelect').show();
				}
          	},
          	error: function(error){
          		//console.log(error);
          	}
    	});
	},


	submitOrder: function(){
		var cartId = this.getCartId();
		var self = this;
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
					self.displayProductsFromCart();
					self.updateProductCount();
				}
          	},
          	error: function(message){
          		//console.log(message);	
          	}
    	});
	},

	cartSummary: function(){
		var cartId = this.getCartId();
		var self = this;
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.Koszyk',
			data: {'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
            cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(cartData){              
				////console.log(cartData);
				$('#cartSummary').html('');
				$('#cartSummary').append('<span>Suma brutto:</span> <span> '+ cartData.ds_brutto_w +' zł</span>');
				$('#cartSummary').append('<br/>');
				$('#cartSummary').append('<span>Suma netto:</span> <span> '+ cartData.ds_netto_w +' zł</span>');
          	},
          	error: function(message){
          		//console.log(message);	
          	}
    	});
	},

	onButtonClick: function(){
		$('.bpm-cart-prod').on('tap', function(event) {
			var id = $(event.target).attr('data-productid');
			localStorage.setItem("product_id", id);
		});
	},

	bindEvents: function(){
		var self = this;

		this.onButtonClick();

		$('.bpm-cart-remove').on('tap', function(event) {
			self.removeProduct(event);
		});
		
		$('.bpm-cart-up').on('tap', function(event) {
			var count = $(event.target).parent().parent().attr('data-count');
			self.increaseProduct(event, parseInt(count) + 1);
		});

		$('.bpm-cart-down').on('tap', function(event) {
			var count = $(event.target).parent().parent().attr('data-count');
			self.increaseProduct(event, (parseInt(count) -1) );
		});

		$('#departmentsSelect').on('change', function(event){
			var department_id = event.target.value;
			self.setDepartment(department_id);
			self.getDepartmentAdresses(department_id);
		});

		$('#departmentsAdressesSelect').on('change', function(event){
			var adress_id = event.target.value;
			self.setAdress(adress_id);
			self.getCostCenters(adress_id);
		});

		$('#costCenterSelect').on('change', function(event){
			var cost_center_id = event.target.value;
			self.setCostCenter(cost_center_id);
//			if(cost_center_id){
//				$('#submitOrder').show();
//			}else{
//				$('#submitOrder').hide();
//			}
		});

		$('#submitOrder').on('tap', function(event){
			self.submitOrder();
		});

		$('#checkCart').on('tap', function(event){
			self.cartSummary();
		});
	}	
}
