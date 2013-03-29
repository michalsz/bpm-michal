var BPApp = {

	start: function(){
		this.displayProfile();
		$('.page').on('pageshow', function(event){
			BPApp.Cart.updateProductCount();
			var showLoginMessage = localStorage.getItem("showLoginMessage");
			localStorage.setItem("showLoginMessage", 0);
			if(showLoginMessage == 0){
				$('#loginMessage').html('');
			}
			$('#productdata').hide();
		});
		$(document).on('pagebeforechange', function(e, data){
			// hack to avoid doing the same work twice, because pagebeforechange is fired twice 
			if (typeof data.toPage !== 'string' ) { 
				// cart 
				$('#cartProducts').html('<h2 class="loadingmsg">Ładowanie...</h2>');
				$('#cartSummary').hide();
				$('#bpm-cartselects').hide();
					$('#departmentsSelect').html('<option data-placeholder="true" value="placeholder">Wybierz oddział</option>');
					$('#departmentsAdressesSelect').html('<option data-placeholder="true" value="placeholder">Wybierz adres</option>');
					$('#costCenterSelect').html('<option data-placeholder="true" value="placeholder">Wybierz centrum kosztowe</option>');					
				$('#submitOrder').hide();
				$('#emptyCartMsg').hide();
				// rest
				$('#myWaitingOrdersList').html('');
				$('#departmentsList').html('');
				$('#productsPriceList').html('');
				$('#categoriesList').html('');
				$('#subcategoriesList').html('');
				$('#productsList').html('');
				
				
								
				$('#addToCart').hide();
				$('.productCount').hide();		
				$('#productdata').hide();		

				
				//$('#reportsSelect').html('<option data-placeholder="true" value="placeholder">Wybierz</option>');
				//$('#reportsPage .loadingmsg').show();
				//$('#reportsPage .ui-content > * ').hide();
				
					
				
				// akceptant
				$('#departmentsListA').html('');
				$('#addressesListA').html('');
				$('#costSourcesListA').html('');
				$('#allOrdersList').html('');
				
				
				
				


				
			} 
		});
		this.setupAjax();
	},

	displayProfile: function(){
		var authorized = localStorage.getItem("authorized");
		var akceptant = localStorage.getItem("akceptant");
		if(authorized == 'true'){
			$('#login').hide();
			$('#logout').show();
			$('#priceList').show();
			$('#departments').show();
			$('#reports').show();
			if(akceptant == 'T'){
				$('#orders').show();
			}else{
				$('#myWaitingOrders').show();
			}
			$('#cartLink').show();
			var showLoginMessage = localStorage.getItem("showLoginMessage");
			var nazwa = localStorage.getItem("nazwa");
			if(showLoginMessage == 1){
				$('#loginMessage').html('Zostałeś pomyślnie zalogowany jako ' + nazwa + '.');
			}else{
				$('#loginMessage').html('');
			}
		}else{
			$('#login').show();
			$('#logout').hide();
			$('#priceList').hide();
			$('#departments').hide();
			$('#reports').hide();
			$('#orders').hide();
			$('#cartLink').hide();			
		}
	},

	setupAjax: function(){
		jQuery.ajaxSetup({
  		  beforeSend: function() {
     		$('#loader').show();
  		  },
  		  complete: function(){
     		$('#loader').hide();
  		  }
		});
	}
}
