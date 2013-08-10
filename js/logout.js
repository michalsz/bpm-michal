$('#logoutPage').on('pageshow', function() {
    BPApp.Logout.start();
});

BPApp.Logout = {
    start: function() {
        this.logout();
        window.location = "index.html";
    },
    logout: function() {
        localStorage.setItem("authorized", false);
        localStorage.removeItem("auth_key");
        localStorage.removeItem("cartId");
        localStorage.removeItem("category");
        localStorage.removeItem("login");
        localStorage.removeItem("productCount");
        localStorage.removeItem("product_id");
        localStorage.removeItem("subcategory");

        window.location = "index.html";
        $('#login').show();
        $('#logout').hide();
        $('#priceList').hide();
        $('#departments').hide();
        $('#reports').hide();
        $('#orders').hide();
        $('#cartLink').hide();
        $('#history').hide();
    }
}
