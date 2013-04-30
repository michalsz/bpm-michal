$('#reportsPage').on('pageshow', function(event) {
    $('#reportsList').html('<h2 class="loadingmsg">Ładowanie...</h2>');
    BPApp.Report.start();
});

$('#reportDetailsPage').on('pageshow', function(event) {
    BPApp.Report.startReportDetailsPage();
});

BPApp.Report = {
    start: function() {
        this.displayReports();
        this.bindEvents();
    },
    startReportDetailsPage: function() {
        var self = this;
        $('#createReport').on('tap', function(event) {
            self.generateReport(event);
        });
        $('#createReport').attr('href', '');
        $('#createReport span span').html('Wygeneruj raport (pdf) <div class="btnloader"></div>');
        $('#createReport').trigger('create');
    },
    displayReports: function() {
        $('#reportsSelect-button .ui-btn-text').append('<div class="btnloader"></div>');
        $('#reportsSelect-button .ui-btn-text .btnloader').css('display', 'inline-block');
        var auth_key = localStorage.getItem("auth_key");
        var self = this;
        if ($('#reportsList').find('li').length === 0) {
            $.ajax({
                url: Config.serviceURL + 'BPK.pkg_json.Raporty',
                data: {'AuthKey': auth_key},
                type: 'GET',
                cache: true,
                dataType: 'jsonp',
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                success: function(data) {
                    $('#reportsList').html('');
                    $.each(data.raporty, function(i, item) {
                        $('#reportsList').append('<li><a href="#reportDetailsPage" class="bpm-report-button" data-reportid="' + item.raport_kod + '"> ' + item.raport_nazwa + '</a></li>');
                    });
                    $('#reportsList').listview('refresh');
                    self.onButtonClick();
                },
                error: function(message) { }
            });
        }
    },
    onButtonClick: function() {
        $('.bpm-report-button').on('tap', function(event) {
            var report_id = $(event.target).attr('data-reportid');
            localStorage.setItem("report_id", report_id);
        });
    },
    displayDocuments: function(event) {
        var auth_key = localStorage.getItem("auth_key");
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.DokNieZaplacone',
            data: {'AuthKey': auth_key},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                $('#documentsList').html('');
                $.each(data.dokumenty, function(i, item) {
                    $('#documentsList').append('<span>' + item.ds_id + ' ' + item.ds_brutto + '</span>');
                })

                if (data.dokumenty.length == 0) {
                    alert('Nie masz dokumentów do zapłaty.');
                }
            },
            error: function(message) { }
        });
    },
    generateReport: function(event) {
        $('#createReport .btnloader').css('display', 'inline-block');
        var auth_key = localStorage.getItem("auth_key");
        var dateSince = $('#dateSince').val();
        var dateTo = $('#dateTo').val();
        var reportType = localStorage.getItem("report_id");
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.Raport',
            data: {'AuthKey': auth_key, 'RaportKod': reportType, 'DataOd': dateSince, 'DataDo': dateTo, 'Typ': 'pdf'},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                $('#createReport .btnloader').css('display', 'none');
                //$('#createReport').attr('href', 'https://docs.google.com/viewer?url=' + data.raport_url);
                $('#createReport').attr('href', '#iframePage');
                
                $('#pdfIframe').attr('src', 'https://docs.google.com/viewer?url=' + data.raport_url);
                $('#createReport span span').html('Pobierz raport (pdf)');
                $('#createReport').trigger('create');
            },
            error: function(message) { }
        });
    },
    bindEvents: function() {
        var self = this;
        $('#documents').on('tap', function(event) {
            self.displayDocuments(event);
        });
    }
}
