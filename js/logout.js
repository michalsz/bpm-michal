$('#logoutPage').on('pageshow', function(){
	BPApp.Logout.start();
});

BPApp.Logout = {

	start: function(){
		this.logout();
	},

	logout: function(){
		localStorage.removeItem("auth_key");
		localStorage.setItem("authorized", false);
		localStorage.removeItem("login", '');
		window.location = "index.html";
	}
}
