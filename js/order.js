$('#ordersPage').on('pageshow', function(event) {
    $('#departmentsListA').html('<h2 class="loadingmsg">Ładowanie...</h2>');
    BPApp.Order.start();
});

$('#ordersAddressesPage').on('pageshow', function(event) {
    $('#addressesListA').html('<h2 class="loadingmsg">Ładowanie...</h2>');
    var department_id = localStorage.getItem("department_id");
    BPApp.Order.displayAddresses(department_id);
    BPApp.Order.bindEvents();
});

$('#ordersCostSourcesPage').on('pageshow', function(event) {
    $('#costSourcesListA').html('<h2 class="loadingmsg">Ładowanie...</h2>');
    var department_id = localStorage.getItem("department_id");
    var address_id = localStorage.getItem("address_id");
    BPApp.Order.displayCostSources(department_id, address_id);
    BPApp.Order.bindEvents();
});

$('#ordersListPage').on('pageshow', function(event) {
    $('#ordersList').html('<h2 class="loadingmsg">Ładowanie...</h2>');
    var department_id = localStorage.getItem("department_id");
    var cost_id = localStorage.getItem("cost_id");
    BPApp.Order.displayOrders(department_id, cost_id, 'ordersList');
});

$('#myWaitingOrdersPage').on('pageshow', function(event) {
    $('#myWaitingOrdersList').html('<h2 class="loadingmsg">Ładowanie...</h2>');
    BPApp.Order.displayMyWaitnigOrders();
});


BPApp.Order = {
    start: function() {
        this.displayDepartments();
        this.bindEvents();
    },
    clearOldData: function() {
        //$('#departmentsSelect').html('');
    },
    displayDepartments: function() {
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
            success: function(data) {
                $('#departmentsListA').html('');
                $.each(data.oddzialy, function(i, item) {
                    $('#departmentsListA').append('<li><a href="#ordersAddressesPage" class="bpm-order-button" data-depid="' + item.kth_id + '">' + item.dak_skrot + ' </a></li>');
                });
                $('#departmentsListA').listview('refresh');

                // FIX 
                $('.bpm-order-button').on('tap', function(event) {
                    var department_id = $(event.target).attr('data-depid');
                    localStorage.setItem("department_id", department_id);
                });
            }
        });
    },
    displayOrders: function(departmentId, costSourceId, elementId) {
        var self = this;
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.DoAkceptacji',
            data: {'OdbId': departmentId, 'CkId': costSourceId, 'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: false,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                $('#' + elementId).html('');

                $.each(data.zamowienia, function(i, item) {
                    $('#' + elementId).append('<li id="orderdetail' + item.ds_id + '"><span class="paramName">Numer dokumentu: <span class="paramValue">' + item.ds_id + '</span></span><span class="paramName">Nazwa Centrum Kosztowego <span class="paramValue">' + item.ck_nazwa + '</span></span><span class="paramName">Cena netto:  <span class="paramValue">' + item.ds_netto + 'zł</span></span><span class="paramName">VAT <span class="paramValue">' + item.ds_vat + 'zł</span></span><span class="paramName">Cena Brutto: <span class="paramValue">' + item.ds_brutto + 'zł</span></span><div id="poz' + item.ds_id + '"></div><a href="#" data-docid="' + item.ds_id + '" data-role="button" class="order-edit-btn">Edytuj</a><a id="orderdetails" href="#" data-docid="' + item.ds_id + '" data-role="button" class="order-detail-btn">Szczegóły</a><a href="#" data-docid="' + item.ds_id + '" data-role="button" class="order-accept-btn">Akceptuj</a><a href="#" data-docid="' + item.ds_id + '" data-role="button" class="order-add-btn">Dodaje produkt</a><a href="#" data-docid="' + item.ds_id + '" data-role="button" class="order-cancel-btn">Odrzuć</a></li>').trigger('create');
                });

                $('.order-detail-btn').trigger('create');
                $('.order-detail-btn').on('tap', function(event) {
                    var doc_id = $(event.target).parents('a').attr('data-docid');
                    self.displayOrderDetail(doc_id);
                    $('.order-detail-btn').css('opacity', '0.3');
                    $('.order-detail-btn').off('tap');
                    //$(event.target).parents('a').remove();
                });


                $('.order-edit-btn').on('tap', function(event) {
                    var doc_id = $(event.target).parents('a').attr('data-docid');
                    self.displayOrderEdit(doc_id);
                });

                $('.order-add-btn').on('tap', function(event) {
                    var doc_id = $(event.target).parents('a').attr('data-docid');
                    self.addToOrder(doc_id);
                });

                $('.order-accept-btn').on('tap', function(event) {
                    var doc_id = $(event.target).parents('a').attr('data-docid');
                    self.acceptOrder(doc_id);
                });

                $('.order-cancel-btn').on('tap', function(event) {
                    var doc_id = $(event.target).parents('a').attr('data-docid');
                    self.cancelOrder(doc_id, true);
                });

                if (data.zamowienia.length == 0) {
                    $('#' + elementId).append('<span>W danym centrum kosztowym brak zamówień</span>');
                }
            },
            error: function(event) {
                var doc_id = $(event.target).attr('data-docid');
                alert('error ' + doc_id);
            }
        });
    },

    addToOrder: function(doc_id){
        var self = this;
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.PozycjeDokDoAkceptacji',
            data: {'DsId': doc_id, 'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                var cartId = BPApp.Cart.createCart();
                
                $.mobile.changePage($("#cart"));
                
                $.each(data.pozycje, function(i, item) {
                    BPApp.Cart.addProduct(item.tow_nazwa, item.pds_tow_id, item.pds_ilosc);
                });
                
                self.cancelOrder(doc_id, false);
                
                
            }
        })
    },

    displayOrderDetail: function(doc_id) {
        $('#orderdetail' + doc_id + ' .order-detail-btn .ui-btn-text').append('<div class="btnloader"></div>');
        $('#orderdetail' + doc_id + ' .order-detail-btn  .ui-btn-text .btnloader').css('display', 'inline-block');
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.PozycjeDokDoAkceptacji',
            data: {'DsId': doc_id, 'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                $('#poz' + doc_id).html('');
                $.each(data.pozycje, function(i, item) {
                    $('#poz' + doc_id).append('<span class="paramName">Szczegóły: <span class="paramValue">' + item.tow_nazwa + ' ' + item.pds_ilosc + item.pds_jm_symbol + '</span></span>');
                });
                $('#orderdetail' + doc_id + ' .order-detail-btn .ui-btn-text .btnloader').css('display', 'none');
            }
        })
    },
    displayOrderEdit: function(doc_id) {
        var self = this;
        $('#orderdetail' + doc_id + ' .order-detail-btn .ui-btn-text').append('<div class="btnloader"></div>');
        $('#orderdetail' + doc_id + ' .order-detail-btn  .ui-btn-text .btnloader').css('display', 'inline-block');
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.PozycjeDokDoAkceptacji',
            data: {'DsId': doc_id, 'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                $('#poz' + doc_id).html('');
                $.each(data.pozycje, function(i, item) {
                    $('#poz' + doc_id).append(
                      '<span class="paramName"><span class="product_details">Szczegóły: <br/><a href="#" data-pdsid="' + item.pds_id + '" class="bpm-remove"></a><a href="#" data-pdsid="' + item.pds_id + '" class="bpm-accept-count"></a></span>'
                    + '<span class="paramValue">' + item.tow_nazwa + ' ' + item.pds_ilosc + ' ' + item.pds_jm_symbol + '</span>'
                    + '<span class="product_change_count"><span class="title">Zmień ilość:</span><br/><input id="count_' + item.pds_id + '" value="' + item.pds_ilosc + '" class="product_count" /><br/></span></span>'
                    );
                });
                $('#orderdetail' + doc_id + ' .order-detail-btn .ui-btn-text .btnloader').css('display', 'none');
                $('.bpm-accept-count').on('tap', function(event) {
                    var pds_id = $(event.target).attr('data-pdsid');
                    var count = $('#count_' + pds_id).val();
                    self.acceptCount(pds_id, count);
                });

                $('.bpm-remove').on('tap', function(event) {
                    var pds_id = $(this).attr('data-pdsid');
                    var count = 0;
                    self.acceptCount(pds_id, count, true);
                    console.log(pds_id);
                })
            }
        })
    },
    acceptCount: function(pds_id, count, to_delete) {
        
        to_delete = to_delete || false;
        
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.ZmienPozycjeZamDoAkcept',
            data: {'PdsId': pds_id, 'Ilosc': count, 'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: false,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                if (data.Komunikat) {
                    alert(data.Komunikat);
                }

                if (data.Zmienione === 'T') {
                    if (!to_delete)
                        alert('Ilość została zaakceptowana');
                    else
                        alert('Usunięto produkt');
                    $('#ordersList').html('<h2 class="loadingmsg">Ładowanie...</h2>');
                    var department_id = localStorage.getItem("department_id");
                    var cost_id = localStorage.getItem("cost_id");
                    BPApp.Order.displayOrders(department_id, cost_id, 'ordersList');
                }
            }
        })
    },
    acceptOrder: function(doc_id) {

        $('#orderdetail' + doc_id + ' .order-accept-btn .ui-btn-text').append('<div class="btnloader"></div>');
        $('#orderdetail' + doc_id + ' .order-accept-btn .ui-btn-text .btnloader').css('display', 'inline-block');
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.AkceptujZamowienieCale',
            data: {'DsId': doc_id, 'Uwagi': '', 'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                if (data.Zaakceptowane == 'T') {
                    $('#orderdetail' + doc_id + ' .order-accept-btn .ui-btn-text .btnloader').css('display', 'none');
                    alert('Zamówienie zostało zaakceptowane');
                    $('#orderdetail' + doc_id).html('');
                }
            }
        })
    },
    cancelOrder: function(doc_id, ifDisplayAlert) {
        $('#orderdetail' + doc_id + ' .order-cancel-btn .ui-btn-text').append('<div class="btnloader"></div>');
        $('#orderdetail' + doc_id + ' .order-cancel-btn .ui-btn-text .btnloader').css('display', 'inline-block');
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.OdrzucZamowienie',
            data: {'DsId': doc_id, 'Uwagi': '', 'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                console.log(data);
                if (ifDisplayAlert && data.Odrzucone == 'T') {
                    $('#orderdetail' + doc_id + ' .order-cancel-btn .ui-btn-text .btnloader').css('display', 'none');
                    alert('Zamówienie zostało odrzucone');
                    $('#orderdetail' + doc_id).html('');
                }
            }
        })
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
                    $('#addressesListA').html('');
                    $.each(data.adresy, function(i, item) {
                        $('#addressesListA').append('<li><a href="#ordersCostSourcesPage" class="bpm-orders-costs-button"  data-addrressid="' + item.dak_id + '">' + item.adr_opis + ' </a></li>');
                    })
                    $('#addressesListA').listview('refresh');
                    self.bindEvents();
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
                cache: true,
                dataType: 'jsonp',
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                success: function(data) {
                    $('#costSourcesListA').html('');
                    $.each(data.centra, function(i, item) {
                        $('#costSourcesListA').append('<li><a href="#ordersListPage" class="bpm-orders-orders-button" data-costid="' + item.ck_id + '">' + item.ck_nazwa + ' </a></li>');
                    });
                    $('#costSourcesListA').listview('refresh');
                    self.bindEvents();
                }
            });
        }
    },
    displayDocuments: function() {
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.DokNieZaplacone',
            data: {'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
//				console.log(data);
            }
        });
    },
    displayMyWaitnigOrders: function() {
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.OczekNaAkceptAkceptanta',
            data: {'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                console.log(data);
                $('#myWaitingOrdersList').html('');
                $.each(data.zamowienia, function(i, item) {
                    $('#myWaitingOrdersList').append('<li><span class="paramName2">Numer:</span><span class="paramValue2">' + item.ds_numer + '</span><br>' +
                            '<span class="paramName2">Data:</span><span class="paramValue2">' + item.ds_data + '</span><br>' +
                            '<span class="paramName2">Wartość netto:</span><span class="paramValue2">' + item.ds_netto + '</span></li>');
                })
                $('#myWaitingOrdersList').listview('refresh');
            }
        });
    },
    bindEvents: function() {
        var self = this;
        $('.bpm-orders-costs-button').on('tap', function(event) {
            var address_id = $(event.target).attr('data-addrressid');
            localStorage.setItem("address_id", address_id);
        });

        $('.bpm-orders-orders-button').on('tap', function(event) {
            var cost_id = $(event.target).attr('data-costid');
            localStorage.setItem("cost_id", cost_id);
        });

        $('#documentsBtn').on('tap', function(event) {
            self.displayDocuments();
        });

        $('#allOrders').on('click', function(event) {
            var addressid = $('.bpm-orders-costs-button').attr('data-addrressid');
            //Platnik - zapytanie o wszystkie zamowienia bez centrum kosztowego - jak nie poda sie centrum kosztowego
            self.displayOrders(addressid, '', 'allOrdersList');
        });

    }
}
