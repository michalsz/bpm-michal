$('#departmentsPage').on('pageshow', function(event){
	BPApp.Department.start();
});
  
  BPApp.Department = {
  	start: function(){
  		this.displayDepartments();
  		this.bindEvents();
  	},

	displayDepartments: function(){
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
    			$('#departmentsList').html('<option value="">Wybierz</option>');
    			$.each(data.oddzialy, function(i, item){
    				$('#departmentsList').append('<option value="' + item.kth_id + '">'+ item.dak_skrot +'</option>');
					$('#departmentsList').selectmenu('refresh');
				})
       		},
       		error: function(){
       			console.log('error');
       		}
   		});
	},

	clearOldData: function(){
		$('#departmentsList').html('');
		$('#adresses').html('');
		$('#costs-sources').html('');
	},

	bindEvents: function(){
		var self = this;

		$('#departmentsList').on('change', function(event) {
			var department_id = $(event.target).val();
			self.getAdresses(department_id);
		})

		$('#adresses').on('change', function(event) {
			var department_id = $('#departmentsList').val();
			var adress_id = $(event.target).val();
			self.getCostsSource(department_id, adress_id);
		})
	},

	getAdresses: function(department_id){
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.AdresyOddzialu',
			data: {'OdbId': department_id, 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
           	cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){           
				$('#adresses').html('<option value="">Wybierz</option>');
				$.each(data.adresy, function(i, item){
					$('#adresses').append('<option value="' + item.dak_id + '">'+ item.adr_opis +'</option>');
					$('#adresses').selectmenu('refresh');
				})
       		}
   		});
	},

	getCostsSource: function(department_id, adress_id){
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.CentraKosztowe',
			data: {'OdbId': department_id, 'AdrId': adress_id, 'Stat': 'A', 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
           	cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){           
				$('#departmentdata').html('');
				$.each(data.centra, function(i, item){
					var limit = item.stat_limit !== null ? item.stat_limit : 0
					$('#departmentdata').append('<li class="bpm-departmentdatalabel">Nazwa: <span class="bpm-departmentdata">' + item.ck_nazwa + '</li>');
					$('#departmentdata').append('<li class="bpm-departmentdatalabel">Ilość dokumentów do akceptacji: <span class="bpm-departmentdata">' + item.stat_count + '</span></li>');
					$('#departmentdata').append('<li class="bpm-departmentdatalabel">Suma netto dokumentów do akceptacji: <span class="bpm-departmentdata">' + item.stat_sum_netto + 'zł</span></li>');
					$('#departmentdata').append('<li class="bpm-departmentdatalabel">Pozostały limit: <span class="bpm-departmentdata">' +  limit +'zł</span></li>');
					$('#departmentdata').listview('refresh');
				})
       		}
   		});
	}
}