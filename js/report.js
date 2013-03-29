$('#reportsPage').on('pageshow', function(event){
	BPApp.Report.start();
});
  
  BPApp.Report = {
  	start: function(){	
		//$('#reportsSelect').selectmenu('disable');
  		this.displayReports();
  		this.bindEvents();
		
  	},

	displayReports: function(){
		//$('#reportsSelect-button .ui-btn-text').append('<div class="btnloader"></div>'); 
		//$('#reportsSelect-button .ui-btn-text .btnloader').css('display','inline-block');			
		var auth_key = localStorage.getItem("auth_key");
		if($('#reportsSelect').find('option').length == 1){
			$.ajax({
				url: Config.serviceURL + 'BPK.pkg_json.Raporty',
				data: {'AuthKey': auth_key},
				type: 'GET',
	           	cache: true,
				dataType: 'jsonp',
				crossDomain: true,
				contentType: 'application/json; charset=utf-8',
				success: function(data){  
					//$('#reportsSelect-button .ui-btn-text .btnloader').css('display','none');					
					$('#reportsSelect').html('<option data-placeholder="true" value="placeholder">Wybierz</option>');
					$('#reportsSelect').html('<option  >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a purus mauris. Ut gravida tempor metus ultricies scelerisque. Aenean nec diam lorem, et interdum augue. Cras sit amet posuere tortor.</option>');
					$('#reportsSelect').html('<option  >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a purus mauris. Ut gravida tempor metus ultricies scelerisque. Aenean nec diam lorem, et interdum augue. Cras sit amet posuere tortor.</option>');
					$('#reportsSelect').html('<option  >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a purus mauris. Ut gravida tempor metus ultricies scelerisque. Aenean nec diam lorem, et interdum augue. Cras sit amet posuere tortor.</option>');
					$('#reportsSelect').html('<option  >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a purus mauris. Ut gravida tempor metus ultricies scelerisque. Aenean nec diam lorem, et interdum augue. Cras sit amet posuere tortor.</option>');
					$('#reportsSelect').html('<option  >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a purus mauris. Ut gravida tempor metus ultricies scelerisque. Aenean nec diam lorem, et interdum augue. Cras sit amet posuere tortor.</option>');
					$('#reportsSelect').html('<option  >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a purus mauris. Ut gravida tempor metus ultricies scelerisque. Aenean nec diam lorem, et interdum augue. Cras sit amet posuere tortor.</option>');
					$('#reportsSelect').html('<option  >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a purus mauris. Ut gravida tempor metus ultricies scelerisque. Aenean nec diam lorem, et interdum augue. Cras sit amet posuere tortor.</option>');
					$('#reportsSelect').html('<option  >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a purus mauris. Ut gravida tempor metus ultricies scelerisque. Aenean nec diam lorem, et interdum augue. Cras sit amet posuere tortor.</option>');
					$('#reportsSelect').html('<option  >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a purus mauris. Ut gravida tempor metus ultricies scelerisque. Aenean nec diam lorem, et interdum augue. Cras sit amet posuere tortor.</option>');
					$('#reportsSelect').html('<option  >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a purus mauris. Ut gravida tempor metus ultricies scelerisque. Aenean nec diam lorem, et interdum augue. Cras sit amet posuere tortor.</option>');
					$('#reportsSelect').html('<option  >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a purus mauris. Ut gravida tempor metus ultricies scelerisque. Aenean nec diam lorem, et interdum augue. Cras sit amet posuere tortor.</option>');
					$('#reportsSelect').html('<option  >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a purus mauris. Ut gravida tempor metus ultricies scelerisque. Aenean nec diam lorem, et interdum augue. Cras sit amet posuere tortor.</option>');
					$('#reportsSelect').html('<option  >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a purus mauris. Ut gravida tempor metus ultricies scelerisque. Aenean nec diam lorem, et interdum augue. Cras sit amet posuere tortor.</option>');
					$('#reportsSelect').html('<option  >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a purus mauris. Ut gravida tempor metus ultricies scelerisque. Aenean nec diam lorem, et interdum augue. Cras sit amet posuere tortor.</option>');
					//$.each(data.raporty, function(i, item){
					//	$('#reportsSelect').append('<option value="' + item.raport_kod + '"> '  + item.raport_nazwa +  '</option>');
//
					//});
					$('#reportsSelect').selectmenu('refresh');
					//$('#reportsSelect').selectmenu('enable');
					$('#createReport').attr('href','');
					$('#createReport span span').html('Wygeneruj raport (pdf) <div class="btnloader"></div>');
					$('#createReport').trigger('create');
					//$('#reportsPage .loadingmsg').hide();
					//$('#reportsPage .ui-content > * ').show();
	       		},
				error: function(message){

	          		}
	   		});
		}
	},
	
	displayDocuments : function(event){
		var auth_key = localStorage.getItem("auth_key");
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.DokNieZaplacone',
			data: {'AuthKey': auth_key},
			type: 'GET',
			cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){    
				$('#documentsList').html('');
				$.each(data.dokumenty, function(i, item){
					$('#documentsList').append('<span>' + item.ds_id + ' '  + item.ds_brutto +  '</span>');
				})

				if(data.dokumenty.length == 0){
					alert('Nie masz dokumentów do zapłaty.');
				}
			},
			error: function(message){
				console.log('errr');
          			console.log(message);
          		}
   		});
	},

	generateReport: function(event){
		if ( $('#reportsSelect').val() == 'placeholder' ) {
			alert('Wybierz rodzaj raportu.');
			return false;
		}
		$('#createReport .btnloader').css('display', 'inline-block');
		var auth_key = localStorage.getItem("auth_key");
		var dateSince = $('#dateSince').val();
		var dateTo = $('#dateTo').val();
		var reportType = $('#reportsSelect').val();
		$.ajax({
			url: Config.serviceURL + 'BPK.pkg_json.Raport',
			data: {'AuthKey': auth_key, 'RaportKod': reportType, 'DataOd': dateSince, 'DataDo': dateTo, 'Typ': 'pdf'},
			type: 'GET',
           	cache: true,
			dataType: 'jsonp',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			success: function(data){ 
				$('#createReport .btnloader').css('display', 'none');
				$('#createReport').attr('href','https://docs.google.com/viewer?url='+data.raport_url);
				$('#createReport span span').html('Pobierz raport (pdf)');
				$('#createReport').trigger('create');
			},
			error: function(message){
					console.log('Błąd generowania raportu: ' + message);
          		}
   		});
	},

	bindEvents: function(){
		var self = this;
		$('#documents').on('tap', function(event) {
			self.displayDocuments(event);
		});

		$('#createReport').on('tap', function(event){
			self.generateReport(event);
		})
	}
}
