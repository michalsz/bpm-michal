$('#departmentsPage').on('pageshow', function(event){
	$('#departmentsList').html('<h2 class="loadingmsg">Ładowanie...</h2>');
	BPApp.Department.start();
});

$('#departmentPage').on('pageshow', function(event){
	$('#adresses').html('<h2 class="loadingmsg">Ładowanie...</h2>');	
	var department_id = localStorage.getItem("department_id");
	BPApp.Department.getAdresses(department_id);
});
  
$('#costSourcesPage').on('pageshow', function(event){
	$('#costSources').html('<h2 class="loadingmsg">Ładowanie...</h2>');	
	var department_id = localStorage.getItem("department_id");
	var adress_id = localStorage.getItem("adress_id");
	BPApp.Department.getCostsSource(department_id, adress_id);
});



  BPApp.Department = {
  	start: function(){
  		this.displayDepartments();
  	},

	displayDepartments: function(){
		var self = this;
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
				console.log(data);
    			$('#departmentsList').html('');
    			$.each(data.oddzialy, function(i, item){
    				$('#departmentsList').append('<li><a href="#departmentPage" class="bpm-department-button"  data-depid="' + item.kth_id + '">'+ item.dak_skrot +'</li>');
			});
			$('#departmentsList').listview('refresh');
			self.bindEvents();
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

		$('.bpm-department-button').on('tap', function(event) {
			var department_id = $(event.target).attr('data-depid');
			localStorage.setItem("department_id", department_id);
		})

		$('.bpm-adress-button').on('tap', function(event) {
			var adress_id = $(event.target).attr('data-adressid');
			localStorage.setItem("adress_id", adress_id);
		})
	},

	getAdresses: function(department_id){
		var self = this;
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.AdresyOddzialu',
			data: {'OdbId': department_id, 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
           	cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){    
				console.log(data); 
				$('#adresses').html('');
				$.each(data.adresy, function(i, item){
					$('#adresses').append('<li><a href="#costSourcesPage" class="bpm-adress-button" data-adressid="' + item.dak_id + '">'+ item.adr_opis +'</li>');
				});
				$('#adresses').listview('refresh');
				self.bindEvents();
       		}
   		});
	},

	getCostsSource: function(department_id, adress_id){
		console.log(department_id + ' ' + adress_id);
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.CentraKosztowe',
			data: {'OdbId': department_id, 'AdrId': adress_id, 'Stat': 'A', 'AuthKey': localStorage.getItem("auth_key")},
			type: 'GET',
           	cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){           
				$('#costSources').html('');
				console.log(data.centra);
				$.each(data.centra, function(i, item){
					var limit = item.stat_limit !== null ? item.stat_limit : 0
					$('#costSources').append('<li class="bpm-departmentdatalabel">Nazwa: <span class="bpm-departmentdata">' + item.ck_nazwa + '</li>');
					$('#costSources').append('<li class="bpm-departmentdatalabel">Dokumenty do akceptacji: <span class="bpm-departmentdata">' + item.stat_count + '</span></li>');
					$('#costSources').append('<li class="bpm-departmentdatalabel">Suma netto dok. do akceptacji: <span class="bpm-departmentdata">' + item.stat_sum_netto + 'zł</span></li>');
					$('#costSources').append('<li class="bpm-departmentdatalabel" style="margin-bottom: 20px;">Pozostały limit: <span class="bpm-departmentdata">' +  limit +'zł</span></li>');
					//$('#costSources').listview('refresh');
				});
				$('#costSources').listview('refresh'); 
       		}
   		});
	}
}
