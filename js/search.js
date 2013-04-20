
$('#search').on('pageshow', function() {
    $('#productsSearchList').html('<h2 class="loadingmsg">Ładowanie...</h2>');
    BPApp.Search.start();
});

BPApp.Search = {
    start: function() {
        this.displayProducts();
        this.bindEvents();
    },
    displayProducts: function() {
        var keyword = localStorage.getItem('keyword');
        var startPoz = localStorage.getItem('startPoz') !== null ? localStorage.getItem('startPoz') : 0;
        var self = this;
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.Towary',
            data: {'KtId': '', 'AuthKey': '', 'Query': keyword, 'StartPoz': startPoz},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                self.displayResultCount(data.towary_count);
                $('#productsSearchList').html('');
                if (data.towary.length > 0) {
                    $.each(data.towary, function(i, item) {
                        BPApp.Products.getProductDetails(item.tow_id, 'productsSearchList');
                    })
                } else {
                    $('#productsSearchList').html('<h2>Brak wyników.</h2>');
                }
            }
        });
    },
    displayResultCount: function(count) {
        var style = "";
        var i = (count / 10);
        $('#pagination').html('');
        for (var j = 0; j < i; j++) {
            $('#pagination').append('<a href="" style="' + style + '"class="pagination_link" data-startpoz="' + j + '">Strona: ' + (j + 1) + '</a>');
        }
    },
    bindEvents: function() {
        var self = this;
        $('.pagination_link').on('tap', function(event) {
            var startPoz = $(event.target).attr('data-startpoz');
            localStorage.setItem('startPoz', startPoz);
            self.displayProducts();
        })

        $('.prod').on('tap', function(event) {
            var id = $(event.target).attr('data-productid');
            localStorage.setItem("product_id", id);
        });
    }
};
