$('#historyPage').on('pageshow', function(event) {
    BPApp.History.start();
});

$('#historyAddressesPage').on('pageshow', function(event) {
    $('#historyAddressesList').html('<h2 class="loadingmsg">Ładowanie...</h2>');
    var department_id = localStorage.getItem("department_id");
    BPApp.History.displayAddresses(department_id);
    //    BPApp.Order.bindEvents();
});

$('#historyCostSourcesPage').on('pageshow', function(event) {
    $('#historyCostSourcesList').html('<h2 class="loadingmsg">Ładowanie...</h2>');
    var department_id = localStorage.getItem("department_id");
    var address_id = localStorage.getItem("address_id");
    BPApp.History.displayCostSources(department_id, address_id);
    //    BPApp.Order.bindEvents();
});

$('#historyDocumentListPage').on('pageshow', function(event) {
    $('#historyCostSourcesList').html('<h2 class="loadingmsg">Ładowanie...</h2>');
    var department_id = localStorage.getItem("department_id");
    var address_id = localStorage.getItem("address_id");
    BPApp.History.getDocuments(department_id, address_id);
});

$('#historyDocumentPage').on('pageshow', function(event) {
    BPApp.History.documentDetails();
});

BPApp.History = {
    start: function() {
        var auth_key = localStorage.getItem("auth_key");
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.Oddzialy',
            data: {'OdbId': '', 'Stat': 'A', 'AuthKey': auth_key},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
		var listId = '#historyDepartmentsList';
                $(listId).html('');
                $.each(data.oddzialy, function(i, item) {
			$(listId).append('<li><a href="#historyAddressesPage" class="bpm-history-button" data-depid="' + item.kth_id + '">' + item.dak_skrot  +' <span class="right">' + item.stat_count  + '</span></a></li>');
                });
                $(listId).listview('refresh');

                // FIX 
                $('.bpm-history-button').on('tap', function(event) {
                    var department_id = $(event.target).attr('data-depid');
                    localStorage.setItem("department_id", department_id);
                });
            }
        });

        this.bindEvents();
    },

    displayAddresses: function(departmentId) {
        var self = this;
        if (departmentId.length > 0) {
            $.ajax({
                url: Config.serviceURL + 'BPK.pkg_json.AdresyOddzialu',
                data: {'OdbId': departmentId, 'AuthKey': localStorage.getItem("auth_key")},
                type: 'GET',
                cache: true,
                dataType: 'jsonp',
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                success: function(data) {
	            var listId = '#historyAddressesList';
                    $(listId).html('');
                    $.each(data.adresy, function(i, item) {
                        $(listId).append('<li><a href="#historyCostSourcesPage" class="bpm-history-costs-button"  data-addrressid="' + item.dak_id + '">' + item.adr_opis + ' </a></li>');
                    })
                    $(listId).listview('refresh');
		    //                    self.bindEvents();
                }
            });
        }
    },

    displayCostSources: function(departmentId, adressId) {
        var self = this;
        if (departmentId.length > 0) {
            $.ajax({
                url: Config.serviceURL + 'BPK.pkg_json.CentraKosztowe',
                data: {'OdbId': departmentId, 'AdrId': adressId, 'Stat': 'A', 'AuthKey': localStorage.getItem("auth_key")},
                type: 'GET',
                cache: false,
                dataType: 'jsonp',
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                success: function(data) {
                    var listId = '#historyCostSourcesList';
		    $(listId).html('');
                    $.each(data.centra, function(i, item) {
                        $(listId).append('<li><a href="#historyDocumentListPage" class="bpm-history-costsources-button" data-costid="' + item.ck_id + '">' + item.ck_nazwa + ' </a></li>');
                    });
                    $(listId).listview('refresh');

		    if(data.centra.length == 0){
			var department_id = localStorage.getItem("department_id");
			self.getDocuments(department_id, '');
		    }
		    //                    self.bindEvents();
                }
            });
        }
    },

    getDocuments: function(odbId, ckId){
        var auth_key = localStorage.getItem("auth_key");
        var self = this;
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.Historia',
            data: {'OdbId': odbId, 'CkId': ckId, AuthKey: auth_key },
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                $('#historyDocumentList').html('');
                $.each(data.zamowienia, function(i, item) {
                    self.displayDocumentDetails(item);
                    self.onButtonClick();
                })

		if(data.zamowienia.length == 0 ){
		    alert('Brak zamówień');
		}
            },
		    error: function() {console.log('error get history documents ') }
        });
    },

    displayDocumentDetails: function(item){
        $('#historyDocumentList').append('<li><a data-transition="slide" class="bpm-product-button" data-documentid="' + item.ds_id + '" href="#historyDocumentPage">' + item.ds_numer + '  '  + item.ds_netto  + ' zł ' + item.ds_brutto  + ' zł <span class="right">' + item.ds_status + '</span></a></li>')
        $('#historyDocumentList').listview('refresh');
    },

    onButtonClick: function(){
        $('.bpm-product-button').on('tap', function(event) {
            var id = $(event.target).attr('data-documentid');
            localStorage.setItem("document_id", id);
        });
    },

    documentDetails: function(){
        var document_id = localStorage.getItem("document_id");
        var auth_key = localStorage.getItem("auth_key");
        var self = this;
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.PozycjeDokHistorii',
            data: {'DsId': document_id, AuthKey: auth_key },
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
		$('#documentProducts').html('');
                $.each(data.pozycje, function(i, item) {
                    self.displayProduct(item);
                })
                self.onProductClick();
            },
            error: function() { }
        });
	self.onAddButtonsClick();
    },

    displayProduct: function(item){
        $('#documentProducts').append('<li><input name="products[]" value="' + item.pds_id  + '" type="checkbox" class="inputItem" data-count="' + item.pds_ilosc + '" /><a data-transition="slide" class="bpm-history-item" >' +  item.tow_kod + ' | ' + item.pds_cena_s_w + ' zł | '+  item.pds_jm_symbol + ' | ' +  item.pds_ilosc + ' | ' + item.pds_netto_w + ' zł| ' + item.pds_sv_symbol + ' | ' + item.pds_vat_w + ' zł | ' +  item.pds_brutto_w  +  'zł </a></li>');
    },

    onProductClick: function(){
        var self = this;
        $('.bpm-history-item').on('tap', function(event) {
	    var id = localStorage.getItem("document_id");
            self.addProductToCart();
        });
    },

    onAddButtonsClick: function(){
        var self = this;
        $('#addToCartOne').on('tap', function(event) {
	    var id = localStorage.getItem("document_id");
	    $.each($('.inputItem'), function(i, item) {
		 if(item.checked){
	            self.addOneProduct(item.value, 1);
		 }
	    })
	    alert('Dodałeś wybrane produkty do koszyka');
        });

        $('#addToCartOriginalCount').on('tap', function(event) {
	    var id = localStorage.getItem("document_id");
	    $.each($('.inputItem'), function(i, item) {
		 if(item.checked){
                    var count = $(item).attr('data-count');
	            self.addOneProduct(item.value, count);
		 }
	    })
	    alert('Dodałeś wybrane produkty do koszyka');
        });


    },

    addOneProduct: function(pdsId, count){
        var dsId = localStorage.getItem("document_id");
        var cartId = BPApp.Cart.getCartId();
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.PrzepiszPozZamDoKoszyka',
		    data: {'DsId': dsId, 'PdsId': pdsId, 'KoszId': cartId, 'Ilosc': count, AuthKey: localStorage.getItem("auth_key") },
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                $('#historyList').html('');
		BPApp.Cart.updateProductCount();
            },
            error: function() { }
        });


    },

    addProductToCart: function(){
        var dsId = localStorage.getItem("document_id");
        var cartId = BPApp.Cart.getCartId();
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.PrzepiszZamowienieDoKoszyka',
            data: {'DsId': dsId, 'KoszId': cartId, AuthKey: localStorage.getItem("auth_key") },
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                $('#historyList').html('');
		alert('Dodałeś wszystkie produktu do koszyka');
		BPApp.Cart.updateProductCount();
            },
            error: function() { }
        });
    },

    bindEvents: function() {
        var authorized = localStorage.getItem("authorized");
        var self = this;
        if (authorized) {
            $('#historyDepartmentsSelect').on('change', function(event) {
                var department_id = event.target.value;

                $('#historyDepartmentsAdressesSelect').html('<option data-placeholder="true" value="placeholder">Wybierz adres</option>');
                $('#historyDepartmentsAdressesSelect').selectmenu('refresh');
                $('#historyDepartmentsAdressesSelect').selectmenu('disable');


                $('#historyCostCenterSelect').html('<option data-placeholder="true" value="placeholder">Wybierz centrum kosztowe</option>');
                $('#historyCostCenterSelect').selectmenu('refresh');
                $('#historyCostCenterSelect').selectmenu('disable');

                BPApp.Cart.getDepartmentAdresses(department_id, 'historyDepartmentsAdressesSelect' );
            });

            $('#historyDepartmentsAdressesSelect').on('change', function(event) {
                var address_id = event.target.value;

                $('#historyCostCenterSelect').html('<option data-placeholder="true" value="placeholder">Wybierz centrum kosztowe</option>');
                $('#historyCostCenterSelect').selectmenu('refresh');
                $('#historyCostCenterSelect').selectmenu('disable');

                BPApp.Cart.getCostCenters(address_id, 'historyCostCenterSelect');
            });

            $('#historyCostCenterSelect').on('change', function(event) {
                var cost_center_id = event.target.value;
                var odb_id = $('#historyDepartmentsSelect').val();
                self.getDocuments(odb_id, cost_center_id);
            });
        };
    }
};
