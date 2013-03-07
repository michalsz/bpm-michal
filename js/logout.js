$('#logoutPage').on('pageshow', function(){
	BPApp.Logout.start();
});

BPApp.Logout = {

	start: function(){
		this.logout();
	},

	logout: function(){
		localStorage.setItem("auth_key", '');
		localStorage.setItem("authorized", false);
		localStorage.setItem("login", '');
		window.location = "index.html";
	}
}