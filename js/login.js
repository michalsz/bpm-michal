$('#loginPage').on('pageshow', function(event){
	BPApp.Login.start();
});

BPApp.Login = {

	start: function(){
		this.bindEvents();
	},

	bindEvents: function(){
		$('#loginbtn').on('click', function(event) {
			var login = $('#user_login').val();
			var password = $('#password').val();
			$.ajax({
				url: Config.serviceURL + 'BPK.pkg_json.Login',
				data: {'Login': login, 'Haslo': password},
				type: 'GET',
            	cache: true,
				dataType: 'jsonp',
				crossDomain: true,
				contentType: 'application/json; charset=utf-8',
				success: function(data){              
					localStorage.setItem("auth_key", data.auth_key);
					localStorage.setItem("authorized", data.success);
					localStorage.setItem("login", login);
					window.location = "index.html";
	            },
    	        error: function(){
        			alert('error');
	        	}
    		});
		})
	},

	callbackM: function(){
		console.log('callback');
	}
}