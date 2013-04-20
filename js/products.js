$('#products').on('pageshow', function(event) {
    $('#productsList').html('<h2 class="loadingmsg">Ładowanie...</h2>');
    BPApp.Products.start();
});

BPApp.Products = {
    start: function() {
        this.getProducts(localStorage.getItem("subcategory"));
        localStorage.setItem('startPoz', 0);
    },
    getProducts: function(subcategory_id) {
        var startPoz = localStorage.getItem('startPoz') !== null ? localStorage.getItem('startPoz') : 0
        var self = this;
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.Towary',
            data: {'KtId': parseInt(subcategory_id), 'AuthKey': '', 'Query': '', 'StartPoz': startPoz},
            jsonpCallback: 'getPr',
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                self.displayResultCount(data.towary_count);
                $('#productsList').html('');
                $.each(data.towary, function(i, item) {
                    self.getProductDetails(item.tow_id, 'productsList');
                })
            },
            error: function() { }
        });
    },
    displayResultCount: function(count) {
        var i = (count / 10);
        $('#paginationplaceholder').html('<div data-role="controlgroup" data-type="horizontal" data-mini="true" id="pagination"></div>');
        var startPoz = parseInt( localStorage.getItem('startPoz') );

        
        if ( startPoz > 0 ) {
            $('#pagination').append('<a id="pagination_prev" href="#" onclick="BPApp.Products.refreshProducts(event)" data-startpoz="' + (startPoz - 1) + '"></a>');
        }
        
        for (var j = 0; j < i; j++) {
            
            if (startPoz === j) {
                $('#pagination').append('<span id="pagination_current"> '+ (j + 1) + '</span>');
            } else {
                $('#pagination')
                    .append('<a href="" onclick="BPApp.Products.refreshProducts(event)" class="pagination_link" data-startpoz="' + j + '">' + (j + 1) + '</a>').trigger('create');
            }
        }
        
        if ( startPoz < i - 1 ) {
            $('#pagination').append('<a id="pagination_next" href="#" onclick="BPApp.Products.refreshProducts(event)" data-startpoz="' + (startPoz + 1) + '"></a>');
        }

        $('#pagination').trigger('create');
    },
            
    refreshProducts: function(event) {
        var startpoz = $(event.target).attr('data-startpoz');
        localStorage.setItem('startPoz', startpoz);
        this.getProducts(localStorage.getItem("subcategory"))
    },
            
    getProductDetails: function(product_id, element_id) {
        var self = this;
        var auth_key = localStorage.getItem("auth_key");
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.Towar',
            data: {'TowId': parseInt(product_id), 'AuthKey': auth_key},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(item) {
                $('#' + element_id).append('<li><a data-transition="slide" class="bpm-product-button" data-productid="' + item.tow_id + '" href="#product">' + item.tow_nazwa + ' <span class="right">' + item.cena_n + ' zł</span></a></li>')
                $('#' + element_id).listview('refresh');
                self.onButtonClick();
            },
            error: function() {
                alert('error');
            }
        });
    },
    onButtonClick: function() {
        $('.bpm-product-button').on('tap', function(event) {
            var id = $(event.target).attr('data-productid');
            localStorage.setItem("product_id", id);
        });
    },
}
