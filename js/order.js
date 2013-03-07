$('#ordersPage').on('pageshow', function(event){
	BPApp.Order.start()
});


  BPApp.Order = {
  	start: function(){
  		this.updateDepartmentsSelect();
  		//this.displayOrders();
  		this.bindEvents();
  	},

  	clearOldData: function(){
  		//$('#departmentsSelect').html('');
  	},

	updateDepartmentsSelect: function(){
  		this.clearOldData();
		var auth_key = localStorage.getItem("auth_key");
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.Oddzialy',
			data: {'OdbId': '', 'Stat': '', 'AuthKey': auth_key},
			type: 'GET',
           	cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){
				$('#departmentsSelectA').html('<option data-placeholder="true">Wybierz</option>');
    			$.each(data.oddzialy, function(i, item){
					$('#departmentsSelectA').append('<option value="'  + item.kth_id +  '">' + item.dak_skrot + ' ' + item.kth_id + ' </option>');
				})
				$('#departmentsSelectA').selectmenu('refresh');
       		}
   		});
	},
	
	displayOrders: function(departmentId, costSourceId){
		var self = this;
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.DoAkceptacji',
			data: {'OdbId': 1048308, 'CkId': 0, 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
           	cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){           
				$('#ordersList').html('');
    			$.each(data.zamowienia, function(i, item){
					$('#ordersList').append('<li id="orderdetail'+item.ds_id+'"><span class="paramName">Numer dokumentu: <span class="paramValue">' + item.ds_id + '</span></span><span class="paramName">Nazwa Centrum Kosztowego <span class="paramValue">' + item.ck_nazwa + '</span></span><span class="paramName">Cena netto:  <span class="paramValue">' + item.ds_netto + 'zł</span></span><span class="paramName">VAT <span class="paramValue">' + item.ds_vat + 'zł</span></span><span class="paramName">Cena Brutto: <span class="paramValue">' + item.ds_brutto + 'zł</span></span><br/><a href="#" data-docid="' +  item.ds_id + '" data-role="button" class="order-detail-btn">Szczegóły</a><a href="#" data-docid="' +  item.ds_id + '" data-role="button" class="order-accept-btn">Akceptuj</a><a href="#" data-docid="' +  item.ds_id + '" data-role="button" class="order-cancel-btn">Odrzuć</a><div id="poz'+item.ds_id+'"></div></li>');

					//$('#ordersList').listview('refresh');
					//$('.order-detail-btn').button('refresh');
				})

				
					$('.order-detail-btn').on('click', function(event) {
		 				var doc_id = $(event.target).attr('data-docid');
		 				self.displayOrderDetail(doc_id);
		 			})

					$('.order-accept-btn').on('click', function(event) {
		 				var doc_id = $(event.target).attr('data-docid');
		 				self.acceptOrder(doc_id);
		 			})

		 			$('.order-cancel-btn').on('click', function(event) {
		 				var doc_id = $(event.target).attr('data-docid');
		 				self.cancelOrder(doc_id);
		 			})

				if(data.zamowienia.length == 0){
					$('#ordersList').append('<span>W danym centrum kosztowym brak zamówień</span>');
				}
       		},
       		error: function(event){
       			var doc_id = $(event.target).attr('data-docid');
       			alert('error ' + doc_id);
       		}
   		});
	},

	displayOrderDetail: function(doc_id){
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.PozycjeDokDoAkceptacji',
			data: {'DsId': doc_id, 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
           	cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){           
    			$('#poz' + doc_id ).html('');
    			$.each(data.pozycje, function(i, item){
					$('#poz' + doc_id ).append('<span>'+ item.tow_nazwa +' ' +  item.pds_ilosc + item.pds_jm_symbol +'</span><br/>');
				})
			}
		})
	},


	acceptOrder: function(doc_id){
		 $.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.AkceptujZamowienieCale',
			data: {'DsId': doc_id, 'Uwagi': '', 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
           	cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){           
				if(data.Zaakceptowane == 'T'){
    				alert('Zamówienie zostało zaakceptowane');
    				$('#orderdetail'+doc_id).html('');	
    			}
			}
		})
	},

	cancelOrder: function(doc_id){
		 $.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.OdrzucZamowienie',
			data: {'DsId': doc_id, 'Uwagi': '', 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
           	cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){           
    			if(data.Odrzucone == 'T'){
    				alert('Zamówienie zostało odrzucone');
    				$('#orderdetail'+doc_id).html('');	
    			}
			}
		})
	},

	updateAdressesSelect: function(departmentId){
		if(departmentId.length > 0){
			$.ajax({
				url: Config.serviceURL + 'BPK.pkg_json.AdresyOddzialu',
				data: {'OdbId': departmentId, 'AuthKey': localStorage.getItem("auth_key")},
				type: 'GET',
           		cache: true,
				dataType: 'jsonp',
				crossDomain: true,
				contentType: 'application/json; charset=utf-8',
				success: function(data){           
					$('#adressesSelectA').html('<option data-placeholder="true">Wybierz</option>');
					$.each(data.adresy, function(i, item){
						$('#adressesSelectA').append('<option value="'  + item.dak_id +  '">' + item.adr_opis + ' </option>');
					})
					$('#adressesSelectA').selectmenu('refresh');
       			}
   			});
   		}
	},


	updateCostSourcesSelect: function(adressId){
		var department_id = $('#departmentsSelectA').val();
		console.log(department_id);
		if(department_id.length > 0){
			$.ajax({
				url: Config.serviceURL + 'BPK.pkg_json.CentraKosztowe',
				data: {'OdbId': department_id, 'AdrId': adressId, 'Stat': 'A', 'AuthKey': localStorage.getItem("auth_key")},
				type: 'GET',
           		cache: true,
				dataType: 'jsonp',
				crossDomain: true,
				contentType: 'application/json; charset=utf-8',
				success: function(data){           
					console.log(data);
					$('#costSourcesSelectA').html('<option data-placeholder="true">Wybierz</option>');
					$.each(data.centra, function(i, item){
						$('#costSourcesSelectA').append('<option value="'  + item.ck_id +  '">' + item.ck_nazwa + ' </option>');
					})
					$('#costSourcesSelectA').selectmenu('refresh');
       			}
   			});
   		}
	},

	bindEvents: function(){
		var self = this;
		 $('#departmentsSelectA').on('change', function(event) {
		 	var department_id = $(event.target).val();
			console.log('--- ' + department_id + '---- end');
		 	if(department_id){
		 		self.updateAdressesSelect(department_id);
		 	}
		 })

		 $('#adressesSelectA').on('change', function(event) {
		 	var address_id = $(event.target).val();
		 	console.log('--- ' + address_id + '---- end');
		 	if(address_id){
		 		self.updateCostSourcesSelect(address_id);
		 	}
		 })

		 $('#costSourcesSelectA').on('change', function(event) {
		 	var department_id = $('#departmentsSelectA').val();
		 	var cost_source_id = $(event.target).val();
		 	self.displayOrders(department_id, cost_source_id);
		 })
	}
}