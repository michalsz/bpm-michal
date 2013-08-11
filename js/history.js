$('#historyPage').on('pageshow', function(event) {
    BPApp.History.start();
});

$('#historyDocumentPage').on('pageshow', function(event) {
    BPApp.History.documentDetails();
});


BPApp.History = {
    start: function() {
        //odbID 1048308
        //ckid 8759
        BPApp.Cart.displayDepartmentsSelect('historyDepartmentsSelect');
        this.bindEvents();
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
                $('#historyList').html('');
                $.each(data.zamowienia, function(i, item) {
                    self.displayDocumentDetails(item);
                    self.onButtonClick();
                })
            },
            error: function() { }
        });
    },

    displayDocumentDetails: function(item){
        $('#historyList').append('<li><a data-transition="slide" class="bpm-product-button" data-documentid="' + item.ds_id + '" href="#historyDocumentPage">' + item.ds_numer + '  '  + item.ds_netto  + ' zł ' + item.ds_brutto  + ' zł <span class="right">' + item.ds_status + '</span></a></li>')
        $('#historyList').listview('refresh');
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
                //$('#historyDocumentDetails').html('');
                poz1 = new Object();
                poz1['pds_id'] = 2394;
                poz1['pds_nr_poz'] =   1;
                poz1['pds_tow_id'] =  1062730;
                poz1['tow_kod'] = "0686";
                poz1['tow_nazwa'] = "FOLIA DO LAMINACJI 60X95 100MIC BŁYSK ANTYSTATYCZNA \f\n100SZT ";
                poz1['pds_sv_symbol'] = "23%";
                poz1['pds_ilosc'] = 1;
                poz1['pds_jm_symbol'] =  "op";
                poz1['pds_cena_s_w'] = 10.29;
                poz1['pds_netto_w'] = 10.29;
                poz1['pds_vat_w'] = 2.37;
                poz1['pds_brutto_w'] = 12.66;

                poz2 = new Object();
                poz2['pds_id'] = 2394;
                poz2['pds_nr_poz'] =   1;
                poz2['pds_tow_id'] =  1062730;
                poz2['tow_kod'] = "0687";
                poz2['tow_nazwa'] = "FOLIA DO LAMINACJI 120X95 100MIC BŁYSK ANTYSTATYCZNA \f\n100SZT ";
                poz2['pds_sv_symbol'] = "23%";
                poz2['pds_ilosc'] = 1;
                poz2['pds_jm_symbol'] =  "op";
                poz2['pds_cena_s_w'] = 20.29;
                poz2['pds_netto_w'] = 20.29;
                poz2['pds_vat_w'] = 4.37;
                poz2['pds_brutto_w'] = 24.66;

                data = new Object();
                data['pozycje'] = [poz1, poz2];
                $.each(data.pozycje, function(i, item) {
                    console.log(item);
                    self.displayProduct(item);
                })
            },
            error: function() { }
        });
    },

    displayProduct: function(item){
        $('#documentProducts').append('<li><a data-transition="slide" class="bpm-product-button">' +  item.tow_kod + ' | ' + item.pds_cena_s_w + ' zł | '+  item.pds_jm_symbol + ' | ' +  item.pds_ilosc + ' | ' + item.pds_netto_w + ' zł| ' + item.pds_sv_symbol + ' | ' + item.pds_vat_w + ' zł | ' +  item.pds_brutto_w  +  'zł </a></li>');
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
