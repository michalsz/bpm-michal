$('#cart').on('pageshow', function() {
    BPApp.Cart.start();
});

BPApp.Cart = {
    start: function() {
        $('#emptyCartMsg').hide();
        $('#bpm-cartselects').hide();
        $('#departmentsSelect').selectmenu('refresh');
        $('#departmentsAdressesSelect').selectmenu('refresh');
        $('#costCenterSelect').selectmenu('refresh');
        $('#departmentsSelect').selectmenu('disable');
        $('#departmentsAdressesSelect').selectmenu('disable');
        $('#costCenterSelect').selectmenu('disable');

		var ifSetAndBlockDropDowns = localStorage.getItem("block_cart_dropdowns");
		if(ifSetAndBlockDropDowns){
			console.log('set dropdowns base on ');
		}

        this.getProductsFromCart(this.displayProductsFromCart);
        this.bindEvents();
        
        var authorized = localStorage.getItem("authorized");
        if (authorized !== 'true') {
            alert('Aby przejsc do koszyka musisz sie zalogowac');
            $.mobile.changePage($("#startPage"));
        }
        
        $('#submitOrder').hide();
    },
            
    getProductsFromCart: function(callback) {
        var self = this;
        var cartId = this.getCartId();
        if (cartId) {
            $.ajax({
                url: Config.serviceURL + 'BPK.pkg_json.PozycjeKoszyka',
                data: {'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key")},
                type: 'GET',
                cache: false,
                dataType: 'jsonp',
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                success: function(cart) {
                    callback(cart);
                }
            })
        }
    },
    displayProductsFromCart: function(cart) {
        $('#cartProducts').html('');
        var productsFromCart = cart;

        if (productsFromCart) {
            $.each(productsFromCart.pozycje, function(i, item) {
                $('#cartProducts').append('<li class="kontener" data-inset="true"><a href="#product" class="bpm-cart-prod" data-productid="' + item.tow_id + '">' + item.tow_nazwa + '</a><div data-role="controlgroup" data-type="horizontal" data-mini="true" class="kontrolki" ><span class="productcountlabel">sztuk:</span><span class="productcount" id="pid' + item.tow_id + '">' + item.pds_ilosc + '</span><a data-role="button" id="pbuttonincrease' + item.tow_id + '" data-icon="arrow-u" data-iconpos="notext" data-wrapperels="span" class="bpm-cart-up" data-count="' + item.pds_ilosc + '" data-pdsid="' + item.pds_id + '">Więcej</a><a data-role="button" id="pbuttondecrease' + item.tow_id + '" data-icon="arrow-d" data-iconpos="notext" data-wrapperels="span" class="bpm-cart-down" data-count="' + item.pds_ilosc + '" data-pdsid="' + item.pds_id + '">Mniej</a><a data-role="button" data-icon="delete" data-iconpos="notext" data-wrapperels="span" class="bpm-cart-remove" data-pdsid="' + item.pds_id + '">Usuń</a></div><div class="btnloader" style="display: none;"></div></li>').trigger('create');
            });
            $('#cartProducts').listview('refresh');

            if (productsFromCart.pozycje.length === undefined) {
                alert('CartID jest niezdefiniowane. Prosimy o kontakt z pomocą techniczną.')
            }
            if (productsFromCart.pozycje.length > 0) {
                BPApp.Cart.displayDepartmentsSelect('departmentsSelect');
                BPApp.Cart.cartSummary();
                $('#bpm-cartselects').show();
                $('#submitOrder').show();
                $('#cartSummary').show();
            } else {
                $('#bpm-cartselects').hide();
                $('#submitOrder').hide();
                $('#cartSummary').hide();
                $('#emptyCartMsg').show();
            }
            BPApp.Cart.bindCartItemEvents();
        }
    },
    updateProductsFromCart: function(cart) {
        var productsFromCart = cart;

        productCount = cart['pozycje'].length;
        localStorage.setItem("productCount", productCount);
        $('.cart-number').html(productCount);

        if (productsFromCart) {
            $.each(productsFromCart.pozycje, function(i, item) {
                $.each(cart.pozycje, function(i, item) {
                    $('#pid' + item.tow_id).text(item.pds_ilosc);
                    $('#pbuttonincrease' + item.tow_id).attr('data-count', item.pds_ilosc);
                    $('#pbuttondecrease' + item.tow_id).attr('data-count', item.pds_ilosc);
                })
            });
            $('#cartProducts').listview('refresh');
            if (productsFromCart.pozycje.length === undefined) {
                alert('CartID jest niezdefiniowane. Prosimy o kontakt z pomocą techniczną.')
            }
            BPApp.Cart.cartSummary();
        }
    },
    displayDepartmentsSelect: function(selectId) {
        $('#departmentsSelect-button .ui-btn-text').append('<div class="btnloader"></div>');
        $('#departmentsSelect-button .ui-btn-text .btnloader').css('display', 'inline-block');
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.Oddzialy',
            data: {'OdbId': '', 'Stat': '', 'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                $('#departmentsSelect-button .ui-btn-text .btnloader').css('display', 'none');
                $('#' + selectId).html('<option data-placeholder="true" value="placeholder">Wybierz oddział</option>');
                $.each(data.oddzialy, function(i, item) {
                    $('#' + selectId).append('<option value="' + item.kth_id + '">' + item.dak_skrot + '</option>');
                })
                $('#' + selectId).selectmenu('refresh');
                $('#' + selectId).selectmenu('enable');
                $('#' + selectId).show();
            }
        })
    },
    createCart: function() {
        var self = this;
        if (localStorage.getItem('cartId') !== undefined && localStorage.getItem('cartId') !== null) {
            return localStorage.getItem('cartId');
        } else {
            $.ajax({
                url: Config.serviceURL + 'BPK.pkg_json.DodajKoszyk',
                data: {'AuthKey': localStorage.getItem("auth_key")},
                type: 'GET',
                cache: false,
                dataType: 'jsonp',
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                success: function(cart) {
                    localStorage.setItem('cartId', cart['kosz_id']);
                },
                error: function(message) {
                }
            });
        }
        return localStorage.getItem('cartId');
    },
    getCartId: function() {
        var cartId = this.createCart();
        return cartId;
    },
    addProduct: function(name, product_id, count) {
        $('#addToCart .btnloader').css('display', 'inline-block');
        var cartId = this.getCartId();
        var self = this;
        
        var hide_alert = false;// localStorage.getItem("hide_added_alert") || false;
        
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.DodajPozycjeKoszyk',
            data: {'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key"), 'TowId': product_id, 'Ilosc': count},
            type: 'GET',
            cache: false,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(message) {
                self.updateProductCount();
                
                if ( !hide_alert )
                    alert('Produkt dodany do koszyka');
                
                localStorage.setItem("hide_added_alert", 0);
                $('#addToCart .btnloader').css('display', 'none');
                $('.productCount').hide();
                $('#addToCart').hide();
                $('#backToProducts').show();
            },
            error: function(message) {

            }
        });
    },
    updateProductCount: function() {
        var cartId = this.getCartId();
        var productCount = 0;
        if (cartId) {
            $.ajax({
                url: Config.serviceURL + 'BPK.pkg_json.PozycjeKoszyka',
                data: {'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key")},
                type: 'GET',
                cache: false,
                dataType: 'jsonp',
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                success: function(cart) {
                    if (cart['pozycje']) {
                        productCount = cart['pozycje'].length;
                        localStorage.setItem("productCount", productCount);
                        $('.cart-number').html(productCount);
                    }
                }
            });
        }
    },
    removeProduct: function(event) {
        var pdsId = $(event.target).parents('a').attr('data-pdsid');
        var cartId = this.getCartId();
        var self = this;
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.UsunPozycjeKoszyk',
            data: {'KoszId': cartId, 'PdsId': pdsId, 'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: false,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(message) {                
                self.updateProductCount();
                self.getProductsFromCart(self.displayProductsFromCart);
            },
            error: function(message) {

            }
        });

    },
    increaseProduct: function(event, number) {
        var pdsId = $(event.target).parents('a').attr('data-pdsid');
        var currentCount = $(event.target).parents('a').attr('data-count');
        var cartId = this.getCartId();
        var self = this;
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.ZmienPozycjeKoszyk',
            data: {'KoszId': cartId, 'PdsId': pdsId, 'Ilosc': number, 'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: false,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(message) {
                if (currentCount == 1) {
                    self.getProductsFromCart(self.displayProductsFromCart);
                    var count = localStorage.getItem("productCount");
                    count -= 1;
                    localStorage.setItem("productCount", count);
                    $('.cart-number').html(count);
                    
                    
                } else {
                    self.getProductsFromCart(self.updateProductsFromCart);
                }
                
                $('.btnloader').hide();
            },
            error: function(message) {

            }
        });
    },
    setDepartment: function(department_id) {
        var cartId = this.getCartId();
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.UstawOdbiorceDlaKoszyk',
            data: {'OdbId': department_id, 'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(message) {
                if (message.ustawione == 'T') {

                }
            },
            error: function(error) {

            }
        });
    },
    getDepartmentAdresses: function(department_id, selectId, callback) {
        $('#departmentsAdressesSelect-button .ui-btn-text').append('<div class="btnloader"></div>');
        $('#departmentsAdressesSelect-button .ui-btn-text .btnloader').css('display', 'inline-block');
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.AdresyOddzialu',
            data: {'OdbId': department_id, 'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                $('#departmentsAdressesSelect-button .ui-btn-text .btnloader').css('display', 'none');
                $('#' + selectId).html('<option data-placeholder="true" value="placeholder">Wybierz adres</option>');
                $.each(data.adresy, function(i, adress) {
                    $('#' + selectId).append('<option value="' + adress.dak_id + '">' + adress.adr_opis + '</option>');
                })
                $('#' + selectId).selectmenu('refresh');
                $('#' + selectId).selectmenu('enable');
                
                if(callback){
					callback();
				}
            }
        })
    },
    setAdress: function(adress_id) {
        var cartId = this.getCartId();
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.UstawAdresDlaKoszyk',
            data: {'AdrId': adress_id, 'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(message) {
                if (message.ustawione == 'T') {
                    $('#costCenterSelect').show();
                }
            },
            error: function(error) { }
        });
    },
    getCostCenters: function(adressId, selectId, callback) {
        $('#costCenterSelect-button .ui-btn-text').append('<div class="btnloader"></div>');
        $('#costCenterSelect-button .ui-btn-text .btnloader').css('display', 'inline-block');
        var cartId = this.getCartId();

        if(selectId == 'historyCostCenterSelect'){
            var departamentId = $('#historyDepartmentsSelect').val();
        }else{
            var departamentId = $('#departmentsSelect').val();
        }
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.CentraKosztowe',
            data: {'OdbId': departamentId, 'AdrId': adressId, 'Stat': 'A', 'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                $('#costCenterSelect-button .ui-btn-text .btnloader').css('display', 'none');
                $('#' + selectId).html('<option data-placeholder="true" value="placeholder">Wybierz centrum kosztowe</option>');
                $.each(data.centra, function(i, item) {
                    $('#' + selectId).append('<option value="' + item.ck_id + '">' + item.ck_nazwa + '</option>');
                })
                $('#' + selectId).selectmenu('refresh');
                $('#' + selectId).selectmenu('enable');

				if(callback){
                	callback();
				}
            }
        });
    },
    setCostCenter: function(cost_center_id) {
        var cartId = this.getCartId();
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.UstawCkDlaKoszyk',
            data: {'CkId': cost_center_id, 'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(message) {
                if (message.ustawione == 'T') {
                    $('#costCenterSelect').show();
                    console.log('odblokuj button');
                    $('#submitOrder').show();
                }
            },
            error: function(error) {

            }
        });
    },
    submitOrder: function() {
       if (($('#departmentsSelect').val() == 'placeholder') ||
                ($('#departmentsSelect').val() == 'placeholder') ||
                ($('#departmentsSelect').val() == 'placeholder')) {

            alert('Przed złożeniem zamówienia musisz wybrać oddział, adres i centrum kosztowe.');

            return false;
        }
        $('#submitOrder .btnloader').css('display', 'inline-block');
        var cartId = this.getCartId();
        var self = this;
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.ZamowKoszyk',
            data: {'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: false,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(message) {
                if (message.Zamowiony == 'T') {
                    $('#submitOrder .btnloader').css('display', 'none');
                    localStorage.removeItem('cartId');
                    $('#cartProducts').html('');
                    $('#bpm-cartselects').hide();
                    $('#submitOrder').hide();
                    $('#cartSummary').hide();
                    $('#emptyCartMsg').show();
                    $('#order_confirmation_dialog').popup('close');
                    alert(message.Komunikat);
                    self.displayProductsFromCart();
                    var productCount = 0;
                    localStorage.setItem("productCount", productCount);
                    $('.cart-number').html(productCount);
                }
            },
            error: function(message) {

            }
        });
    },
    cartSummary: function(callback) {
        var cartId = this.getCartId();
        var self = this;
        $.ajax({
            url: Config.serviceURL + 'BPK.pkg_json.Koszyk',
            data: {'KoszId': cartId, 'AuthKey': localStorage.getItem("auth_key")},
            type: 'GET',
            cache: false,
            dataType: 'jsonp',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            success: function(cartData) {
		    var updateSelects = localStorage.getItem("updateCartSelects");
                if(cartData.ds_id_odb && updateSelects == 1){
		    //		    localStorage.setItem("updateCartSelects", 0);
                    $('#departmentsSelect').val(cartData.ds_id_odb); 
                    $('#departmentsSelect').selectmenu('refresh'); 
                    updateAdresessesSelect = function(){
                        $('#departmentsAdressesSelect').val(cartData.ds_id_adr); 
                        $('#departmentsAdressesSelect').selectmenu('refresh'); 
                    }

                    self.getDepartmentAdresses(cartData.ds_id_odb, 'departmentsAdressesSelect', updateAdresessesSelect);
                    updateCostCenterSelect = function(){
                        $('#costCenterSelect').val(cartData.ds_ck_id); 
                        $('#costCenterSelect').selectmenu('refresh'); 
                    }
                    self.getCostCenters(cartData.ds_id_adr, 'costCenterSelect', updateCostCenterSelect);
					$('#add-from-catalog').show();
                }else{
					$('#add-from-catalog').hide();
				}
                
                $('#cartSummary').html('');
                $('#cartSummary').append('<span>Suma brutto:</span> <span> ' + cartData.ds_brutto_w + ' zł</span>');
                $('#cartSummary').append('<br/>');
                $('#cartSummary').append('<span>Suma netto:</span> <span> ' + cartData.ds_netto_w + ' zł</span>');
            },
            error: function(message) {

            }
        });
    },
    onButtonClick: function() {
        $('.bpm-cart-prod').on('tap', function(event) {
            var id = $(event.target).attr('data-productid');
            localStorage.setItem("product_id", id);
        });
    },
    bindCartItemEvents: function() {
        var self = this;
        var interval;

        this.onButtonClick();

        $('.bpm-cart-remove').on('tap', function(event) {
            self.removeProduct(event);
        });

        $('.bpm-cart-up').on('tap', function(event) {
            var count = parseInt( $(this).prev().html() ) + 1;
            
            $(this).prev().html( count );
            $(this).attr('data-count', count);

            clearInterval(interval);
            
            interval = setTimeout(function() {
                $('.btnloader').show();
                self.increaseProduct(event, count);
            }, 1000);
        });

        $('.bpm-cart-down').on('tap', function(event) {
            var count = parseInt( $(this).prev().prev().html() ) - 1;
            
            $(this).prev().prev().html( count );
            $(this).attr('data-count', count);
            
            clearInterval(interval);
            
            interval = setTimeout(function() {
                $('.btnloader').show();
                self.increaseProduct(event, count);
            }, 1000);
        });
    },
    bindEvents: function() {
        var self = this;

        $('#departmentsSelect').on('change', function(event) {
            var department_id = event.target.value;
            self.setDepartment(department_id);

            $('#departmentsAdressesSelect').html('<option data-placeholder="true" value="placeholder">Wybierz adres</option>');
            $('#departmentsAdressesSelect').selectmenu('refresh');
            $('#departmentsAdressesSelect').selectmenu('disable');


            $('#costCenterSelect').html('<option data-placeholder="true" value="placeholder">Wybierz centrum kosztowe</option>');
            $('#costCenterSelect').selectmenu('refresh');
            $('#costCenterSelect').selectmenu('disable');

            self.getDepartmentAdresses(department_id, 'departmentsAdressesSelect');
        });

        $('#departmentsAdressesSelect').on('change', function(event) {
            var adress_id = event.target.value;
            self.setAdress(adress_id);

            $('#costCenterSelect').html('<option data-placeholder="true" value="placeholder">Wybierz centrum kosztowe</option>');
            $('#costCenterSelect').selectmenu('refresh');
            $('#costCenterSelect').selectmenu('disable');

            self.getCostCenters(adress_id, 'costCenterSelect');
        });

        $('#costCenterSelect').on('change', function(event) {
            var cost_center_id = event.target.value;
            self.setCostCenter(cost_center_id);
        });

		console.log('bind');
        $('#submitOrderConfirmation').on('tap', function(event) {
			console.log('submit');
            self.submitOrder();
        });

        $('#checkCart').on('tap', function(event) {
            self.cartSummary();
        });
    }
}
