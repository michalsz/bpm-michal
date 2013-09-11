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
    BPApp.History.getDocuments(department_id, address_id, '#historyDocumentListA');
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
			$(listId).append('<li><a href="#historyAddressesPage" class="bpm-history-button" data-depid="' + item.kth_id + '">' + item.dak_skrot  +'</a></li>');
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
			self.getDocuments(department_id, '', '#historyDocumentList');
		    }
		    //                    self.bindEvents();
                }
            });
        }
    },

    getDocuments: function(odbId, ckId, elementId){
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
			self.displayDocumentDetails(i, item, elementId);
                    self.onButtonClick();
                })

		if(data.zamowienia.length == 0 ){
		    alert('Brak zamówień');
		}
           },
           error: function() {console.log('error get history documents ') }
        });
    },

    displayDocumentDetails: function(i, item, element_id){
	if(!i){
	  $(element_id).append('<li class="header">' + '<span class="cell">Numer</span><span class="cell">Data</span><span class="cell">Wartość netto</span><span class="cell">Status</span>' + '</a></li>')
	}
	$(element_id).append('<li class="aa" data-documentid="' + item.ds_id + '"><a data-transition="slide" class="bpm-product-button" data-documentid="' + item.ds_id + '" href="#historyDocumentPage">' + '<span class="cell"><strong data-documentid="' + item.ds_id + '">' + item.ds_numer + '</strong></span><span class="cell">' + ( item.hasOwnProperty("ds_data") ? item.ds_data : "" )+ '</span><span class="cell tright" data-documentid="' + item.ds_id + '">' + item.ds_netto.toFixed(2) + '&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="cell" data-documentid="' + item.ds_id + '">' + item.ds_status + '</span>' + '</a></li>')
        $(element_id).listview('refresh');
    },

    onButtonClick: function(){
        $('li.aa').on('tap', function(event) {
            var id = $(event.target).attr('data-documentid');
            localStorage.setItem("document_id", id);
        });

    },

    documentDetails: function(){
	$('#addToCartFromHistory').unbind();
	$('#addToCartOne').unbind();
	$('#addToCartOriginalCount').unbind();
        var document_id = localStorage.getItem("document_id");
        var auth_key = localStorage.getItem("auth_key");
        var self = this;
	console.log(document_id);
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
                    self.displayProduct(i, item);
                })
            },
            error: function() { }
        });
	self.onAddToCartClick();
	self.onAddButtonsClick();
    },

    displayProduct: function(i, item){
		if(!i)
		{
			$('#documentProducts').append('<li class="header"><span class="cell">W koszyku</span><span class="cell">Kod towaru</span><span class="cell">Ilość</span><span class="cell">Cena netto</span></li>');
		}
        $('#documentProducts').append('<li><span class="cell"><input name="products[]" value="' + item.pds_id  + '" type="checkbox" class="inputItem" data-count="' + item.pds_ilosc + '" /></span><span class="cell">' +  item.tow_nazwa + ' ' + item.tow_kod + '</span><span class="cell tcenter">' +  item.pds_ilosc + '</span><span class="cell tright">' +  item.pds_netto_w.toFixed(2) + ' PL</span></li>');
    },

    onAddToCartClick: function(){
	console.log('on product click');
        var self = this;
        $('#addToCartFromHistory').on('tap', function(event) {
	     var id = localStorage.getItem("document_id");
             self.addProductToCart();
         });
    },

    onAddButtonsClick: function(){
        var self = this;
        $('#addToCartOne').on('tap', function(event) {
	    var id = localStorage.getItem("document_id");
	    var added = false
	    $.each($('.inputItem'), function(i, item) {
		 if(item.checked){
	           self.addOneProduct(item.value, 1);
  		   added = true;
		 }
	    })
            if(added){
	      alert('Dodałeś wybrane produkty do koszyka');
	    }
        });

        $('#addToCartOriginalCount').on('tap', function(event) {
	    var id = localStorage.getItem("document_id");
	    var added = false;
	    $.each($('.inputItem'), function(i, item) {
		 if(item.checked){
                    var count = $(item).attr('data-count');
	            self.addOneProduct(item.value, count);
		    added = true;
		 }
	    })
            if(added){		
  	      alert('Dodałeś wybrane produkty do koszyka');
	    }
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
	console.log('----adding ---');
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
                self.getDocuments(odb_id, cost_center_id, '#historyDocumentListA');
            });
        };
    }
};
