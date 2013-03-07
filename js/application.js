var BPApp = {

	start: function(){
		this.displayProfile();
		$('.page').on('pageshow', function(){
			BPApp.Cart.updateProductCount();
		});
		this.setupAjax();
	},

	displayProfile: function(){
		var authorized = localStorage.getItem("authorized");
		if(authorized == 'true'){
			$('#login').hide();
			$('#logout').show();
			$('#priceList').show();
			$('#departments').show();
			$('#reports').show();
			$('#orders').show();
			$('#cartLink').show();
		}else{
			$('#login').show();
			$('#logout').hide();
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
