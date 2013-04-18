$('#loginPage').on('pageshow', function(event) {
    BPApp.Login.start();
});

BPApp.Login = {
    start: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        $('#loginbtn').on('tap', function(event) {
            var login = $('#user_login').val();
            var password = $('#password').val();
            $('#loginbtn .btnloader').css('display', 'inline-block');
            $.ajax({
                url: Config.serviceURL + 'BPK.pkg_json.Login',
                data: {'Login': login, 'Haslo': password},
                type: 'GET',
                cache: true,
                dataType: 'jsonp',
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                success: function(data) {
                    console.log(data);  
                    
                    $('#loginbtn .btnloader').css('display', 'none');
                    
                    if ( data.success == 'false' ) {
                        alert('Niepoprawne dane logowania');
                    } else {
                        
                        localStorage.removeItem("auth_key");
                        localStorage.removeItem("cartId");
                        localStorage.removeItem("category");
                        localStorage.removeItem("login");
                        localStorage.removeItem("productCount");
                        localStorage.removeItem("product_id");
                        localStorage.removeItem("subcategory");

                        localStorage.setItem("auth_key", data.auth_key);
                        localStorage.setItem("authorized", data.success);
                        localStorage.setItem("login", login);
                        localStorage.setItem("nazwa", data.nazwa);
                        localStorage.setItem("rola", data.rola);
                        localStorage.setItem("akceptant", data.akceptant);
                        localStorage.setItem("showLoginMessage", 1);

                        //$.mobile.changePage($("#startPage"));
                        window.location = "index.html";
                    }
                },
                error: function() {alert('test'); }
            });
        });
    },
    callbackM: function() { }
};
