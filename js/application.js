var BPApp = {
    start: function() {
        this.displayProfile();
        $('.page').on('pageshow', function(event) {
            BPApp.Cart.updateProductCount();
            var showLoginMessage = localStorage.getItem("showLoginMessage");
            localStorage.setItem("showLoginMessage", 0);
            if (showLoginMessage === 0) {
                $('#loginMessage').html('');
            }
            $('#productdata').hide();
        });
        $(document).on('pagebeforechange', function(e, data) {
            // hack to avoid doing the same work twice, because pagebeforechange is fired twice 
            if (typeof data.toPage !== 'string') {
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
                $('#productsSearchList').html('');

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

        $(document).ready(function() {
            $('#searchInput').on('keydown', function(e) {
                if (e.keyCode == 13) {
                    var keyword = $('#searchInput').val();
                    localStorage.setItem('keyword', keyword);

                    $('#searchInput').val('');

                    window.location = "#search";
                }
            });
        });
    },
    displayProfile: function() {
        var authorized = localStorage.getItem("authorized");
        var akceptant = localStorage.getItem("akceptant");
        if (authorized == 'true') {
            $('#main_logout').show();
            $('#main_logout_not_logged').hide();
            $('#login').hide();
            $('#logout').show();
            $('#priceList').show();
            $('#departments').show();
            $('#reports').show();
            if (akceptant == 'T') {
                $('#orders').show();
            } else {
                $('#myWaitingOrders').show();
            }
            $('#cartLink').show();
            var showLoginMessage = localStorage.getItem("showLoginMessage");
            var nazwa = localStorage.getItem("nazwa");
            if (showLoginMessage == 1) {
                $('#loginMessage').html('Zostałeś pomyślnie zalogowany jako ' + nazwa + '.');
            } else {
                $('#loginMessage').html('');
            }
        } else {
            $('#login').show();
            $('#logout').hide();
            $('#priceList').hide();
            $('#departments').hide();
            $('#reports').hide();
            $('#orders').hide();
            $('#cartLink').hide();
        }
    },
    setupAjax: function() {
        jQuery.ajaxSetup({
            cache: false,
            beforeSend: function() {
                $('#loader').show();
            },
            complete: function() {
                $('#loader').hide();
            }
        });
    }
}


$('.openlink').on('tap', function() {
    window.open($(this).attr('url'), "_system");
});

$('#wwwNotification').on('tap', function() {
    alert('Przejdź do przeglądarki by odwiedzić stronę');
    window.open( $(this).attr('url'), '_system' );
});

$('[data-rel="back"]').on('click', function() {
    var url = window.location.hash;
    
    console.log(url);
});

$('#main_logout').on('click', function(e) {
    var authorized = localStorage.getItem("authorized");
    if (authorized !== 'true')
        e.preventDefault();
});


$('#pdfIframe')
        .height( window.innerHeight-70)
        .width( window.innerWidth-25);