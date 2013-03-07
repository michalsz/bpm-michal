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
					$('#departmentsSelectA').append('<option value="'  + item.kth_id +  '">' + item.dak_skrot + ' </option>');
				})
				$('#departmentsSelectA').selectmenu('refresh');
       		}
   		});
	},
	
	displayOrders: function(departmentId, costSourceId){
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.DoAkceptacji',
			data: {'OdbId': departmentId, 'CkId': costSourceId, 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
           	cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){           
				$('#ordersList').html('');
    			console.log(data);
    			$.each(data.zamowienia, function(i, item){
					$('#ordersList').append('<li><span class="paramName">Numer dokumentu: <span class="paramValue">' + item.ds_id + '</span></span><span class="paramName">Nazwa Centrum Kosztowego <span class="paramValue">' + item.ck_nazwa + '</span></span><span class="paramName">Cena netto:  <span class="paramValue">' + item.ds_netto + 'zl</span></span><span class="paramName">VAT <span class="paramValue">' + item.ds_vat + 'zl</span></span><span class="paramName">Cena Brutto: <span class="paramValue">' + item.ds_brutto + '</span></span></li>');
				})

				$('#ordersList').listview('refresh');

				if(data.zamowienia.length == 0){
					$('#ordersList').append('<span>W danym centrum kosztowym brak zamówień</span>');
				}
       		},
       		error: function(){
       			alert('error');
       		}
   		});
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