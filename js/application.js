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
				$('#loginMessage').html('Zostałes pomyślnie zalogowany jako ' + nazwa);
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
