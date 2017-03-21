//----------[BILLS]
window.billsObject = {};

// Determine theme depending on device
var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;
window.hasRegistered = false;
// Set Template7 global devices flags
Template7.global = {
    android: isAndroid,
    ios: isIos,
    isBrowser: (!isIos && !isAndroid)
};
// Define Dom7
var $$ = Dom7;
// Add CSS Styles

if (isAndroid) {
    $$('head').append('<link rel="stylesheet" href="css/framework7.material.min.css">' + '<link rel="stylesheet" href="css/framework7.material.colors.min.css">' +
        '<link rel="stylesheet" href="dist/framework7.3dpanels.css">');
    //  $$('head').append('<link rel="stylesheet" href="css/framework7.ios.min.css">' + '<link rel="stylesheet" href="css/framework7.ios.colors.min.css">' +
    //    '<link rel="stylesheet" href="dist/framework7.3dpanels.css">');
}
else {
    $$('head').append('<link rel="stylesheet" href="css/framework7.ios.min.css">' + '<link rel="stylesheet" href="css/framework7.ios.colors.min.css">' +
        '<link rel="stylesheet" href="dist/framework7.3dpanels.css">');
}
// Change Through navbar layout to Fixed
if (isAndroid) {
    // Change class
    $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    $$('.view .navbar').prependTo('.view .page');
}
// Init App
var myApp = new Framework7(
    {
        swipePanel: 'left',
        materialRipple: true,
        cacheDuration: 3 * 60 * 1000,
        // Enable Material theme for Android device only
        material: isAndroid ? true : false,
        // Enable Template7 pages
        template7Pages: true,
        onPageInit: function (page) {
            if (page.params.dynamicPageUrl == "content-{{index}}") {

            }
        },
        onAjaxStart: function (xhr) {
            myApp.showIndicator();
        },
        onAjaxComplete: function (xhr) {
            myApp.hideIndicator();
        }
    });
// Init View
var mainView = myApp.addView('.view-main',
    {
        dynamicNavbar: true
    });
//-----[INDEX PAGE]
myApp.onPageInit('news', function (page) {

});
// myApp.onPageBeforeAnimation('index', function (page) {
//     if (isLoggedIn()) {
//         if (isAndroid) {
//             $('#login_in').css('margin-top', '56px');
//         } else {
//             $('#login_in').css('margin-top', '20px');
//         }
//         $('#topname').html('Dashboard');
//         $('#login_top').css('margin-top', '40px');

//         $('#login_logo').hide();
//         $('#login_out').hide();
//         $('#login_in').show();
//         $('#panelloginout').hide();
//         $('#panelloginin').show();
//         myApp.closePanel();
//         mainView.hideToolbar();

//         LoadUser();
//     } else {
//         $('#topname').html('Sign In');
//         $('#login_top').css('margin-top', '15%');
//         $('#login_logo').show();
//         $('#login_out').show();
//         $('#login_in').hide();
//         $('#panelloginout').show();
//         $('#panelloginin').hide();
//         myApp.closePanel()
//         mainView.showToolbar();
//     }
// })

//-----[REFIll2]
myApp.onPageInit('refill2', function (page) {
    var d = window.mmDepositOrder;
    var phone = d.data.phone;
    var amount = d.data.amount;
    $('#descDepo').html('');
    $('#titleDesc').html('Order Created: ' + d.data.order);
    $('#instaBox').slideDown();
    window.InstaPayAPI.init('1W7CAdpCgOXmopWexUhQCa0GP2jlgzRS', function () {
        d.data.phonenumber = phone;
        d.data.city = 'Kampala';
        d.data.address = 'Kampala';
        window.InstaPayAPI.pay(
            {
                'width': $('#instaBox').width(),
                'cart': [
                    {
                        'name': "EasyPay Deposit " + phone,
                        'price': amount,
                        'weight': 0,
                        'qty': 1,
                        'pid': d.data.pid
                    }],
                'buyer': d.data,
                'border': 0,
                'showheader': 0,
                'orderId': d.data.order
            });
        $('#instaPayLogo').hide();
        $('#d_loading').hide();
        $('.txt-fld').css('color', 'gray').css('padding-left', '0px').css('padding-right', '0px');
        $('.good_input').css('width', '100%').css('font-size', '14px').css('background', 'transparent').css('border-top', 'none').css('border-left', 'none').css('border-right', 'none').css('font-family', "'Ubuntu', sans-serif;");;
        $('#InstaPayRemitOverlay').css('color', 'gray');
        $('#InstaPayRemitOverlay').css('background-color', 'transparent');
    });
})
//-----[REFILL]
myApp.onPageInit('refill', function (page) {
    var uobj = getuobj();
    $('#rsPhone_sle').val(uobj.phone);
});
//-----[STATEMENTS]
myApp.onPageInit('statements', function (page) {
    LoadStatements(1, 25);
});

//-----[COMMISSIONS]
myApp.onPageInit('commissions', function (page) {
    LoadCommissionStatements(1, 25);
});

//-----[RECOVER PAGE]
myApp.onPageInit('recover', function (page) {
    myApp.closePanel();
    mainView.hideToolbar();
});
myApp.onPageBack('recover', function (page) {
    myApp.closePanel()
    mainView.showToolbar();
});
//-----[REGISTER PAGE]
myApp.onPageInit('register', function (page) {
    myApp.closePanel();
    mainView.hideToolbar();
});
myApp.onPageBack('register', function (page) {
    myApp.closePanel()
    mainView.showToolbar();
});

myApp.onPageInit('payairtel', function (page) {
    var uobj = getuobj();
    console.log(uobj);
    className = "flag flag-" + uobj.countryCode.toLowerCase();
    if (window.countrySupported == 0) {
        $('#airtel_forex_block').show();
        $('#airtel_flagHolder').attr('class', '').addClass(className);
        $('#airtelAmount_sle').attr('placeholder', 'Amount (' + uobj.currencyCode + ')');
    } else {
        $('#airtel_forex_block').hide();
        $('#airtel_flagHolder').attr('class', '').addClass(className);
    }
    $('#airtelAmount_sle').on('input', function () {
        if (window.countrySupported == 0) {
            var amt = parseFloat($('#airtelAmount_sle').val());
            if (amt) {
                var charge = amt * 0.01 * parseFloat(window.mystats.forexObj.UG_forexPercentage);
                var fxamt = amt - charge;
                var toUSD = fxamt / parseFloat(window.mystats.forexObj.exchangeRateFrom);
                var toUGX = Math.floor(toUSD * parseFloat(window.mystats.forexObj.exchangeRateUG));
                $('#airtelforexamount').html('UGX ' + numberWithCommas(toUGX));
            } else {
                $('#airtelforexamount').html('UGX 0');
            }
        }
    });
});

myApp.onPageInit('paynwsc', function (page) {
    var uobj = getuobj();
    className = "flag flag-" + uobj.countryCode.toLowerCase();
    if (window.countrySupported == 0) {
        $('#nwscinet_forex_block').show();
        $('#nwscinet_flagHolder').attr('class', '').addClass(className);
        $('#nwscinetAmount_sle').attr('placeholder', 'Amount (' + uobj.currencyCode + ')');
    } else {
        $('#nwscinet_forex_block').hide();
        $('#nwscinet_flagHolder').attr('class', '').addClass(className);
    }
    $('#nwscinetAmount_sle').on('input', function () {
        if (window.countrySupported == 0) {
            var amt = parseFloat($('#nwscinetAmount_sle').val());
            if (amt) {
                var charge = amt * 0.01 * parseFloat(window.mystats.forexObj.UG_forexPercentage);
                var fxamt = amt - charge;
                var toUSD = fxamt / parseFloat(window.mystats.forexObj.exchangeRateFrom);
                var toUGX = Math.floor(toUSD * parseFloat(window.mystats.forexObj.exchangeRateUG));
                $('#nwscinetforexamount').html('UGX ' + numberWithCommas(toUGX));
            } else {
                $('#nwscinetforexamount').html('UGX 0');
            }
        }
    });
    fetchPriceList('NWSC', '#picker-device-nwsc', "Initializing...Please Wait");
});

//-----[Umeme Postpaid]
myApp.onPageInit('payumeme', function (page) {
    var uobj = getuobj();
    className = "flag flag-" + uobj.countryCode.toLowerCase();
    if (window.countrySupported == 0) {
        $('#umeme2_forex_block').show();
        $('#umeme2_flagHolder').attr('class', '').addClass(className);
        $('#umeme2Amount_sle').attr('placeholder', 'Amount (' + uobj.currencyCode + ')');
    } else {
        $('#umeme2_forex_block').hide();
        $('#umeme2_flagHolder').attr('class', '').addClass(className);
    }
    $('#umeme2Amount_sle').on('input', function () {
        if (window.countrySupported == 0) {
            var amt = parseFloat($('#umeme2Amount_sle').val());
            if (amt) {
                var charge = amt * 0.01 * parseFloat(window.mystats.forexObj.UG_forexPercentage);
                var fxamt = amt - charge;
                var toUSD = fxamt / parseFloat(window.mystats.forexObj.exchangeRateFrom);
                var toUGX = Math.floor(toUSD * parseFloat(window.mystats.forexObj.exchangeRateUG));
                $('#umeme2forexamount').html('UGX ' + numberWithCommas(toUGX));
            } else {
                $('#umeme2forexamount').html('UGX 0');
            }
        }
    });
});
//-----[Yaka]
myApp.onPageInit('payyaka', function (page) {
    var uobj = getuobj();
    className = "flag flag-" + uobj.countryCode.toLowerCase();
    if (window.countrySupported == 0) {
        $('#umeme_forex_block').show();
        $('#umeme_flagHolder').attr('class', '').addClass(className);
        $('#umemeAmount_sle').attr('placeholder', 'Amount (' + uobj.currencyCode + ')');
    } else {
        $('#umeme_forex_block').hide();
        $('#umeme_flagHolder').attr('class', '').addClass(className);
    }
    $('#umemeAmount_sle').on('input', function () {
        if (window.countrySupported == 0) {
            var amt = parseFloat($('#umemeAmount_sle').val());
            if (amt) {
                var charge = amt * 0.01 * parseFloat(window.mystats.forexObj.UG_forexPercentage);
                var fxamt = amt - charge;
                var toUSD = fxamt / parseFloat(window.mystats.forexObj.exchangeRateFrom);
                var toUGX = Math.floor(toUSD * parseFloat(window.mystats.forexObj.exchangeRateUG));
                $('#umemeforexamount').html('UGX ' + numberWithCommas(toUGX));
            } else {
                $('#umemeforexamount').html('UGX 0');
            }
        }
    });
});
//-----[MTN Airtime]
myApp.onPageInit('paymtn', function (page) {
    var uobj = getuobj();
    className = "flag flag-" + uobj.countryCode.toLowerCase();
    if (window.countrySupported == 0) {
        $('#mtn_forex_block').show();
        $('#mtn_flagHolder').attr('class', '').addClass(className);
        $('#mtnAmount_sle').attr('placeholder', 'Amount (' + uobj.currencyCode + ')');
    } else {
        $('#mtn_forex_block').hide();
        $('#mtn_flagHolder').attr('class', '').addClass(className);
    }
    $('#mtnAmount_sle').on('input', function () {
        if (window.countrySupported == 0) {
            var amt = parseFloat($('#mtnAmount_sle').val());
            if (amt) {
                var charge = amt * 0.01 * parseFloat(window.mystats.forexObj.UG_forexPercentage);
                var fxamt = amt - charge;
                var toUSD = fxamt / parseFloat(window.mystats.forexObj.exchangeRateFrom);
                var toUGX = Math.floor(toUSD * parseFloat(window.mystats.forexObj.exchangeRateUG));
                $('#mtnforexamount').html('UGX ' + numberWithCommas(toUGX));
            } else {
                $('#mtnforexamount').html('UGX 0');
            }
        }
    });
});

//-----[Africell Airtime]
myApp.onPageInit('payafricell', function (page) {
    var uobj = getuobj();
    className = "flag flag-" + uobj.countryCode.toLowerCase();
    if (window.countrySupported == 0) {
        $('#africell_forex_block').show();
        $('#africell_flagHolder').attr('class', '').addClass(className);
        $('#africellAmount_sle').attr('placeholder', 'Amount (' + uobj.currencyCode + ')');
    } else {
        $('#africell_forex_block').hide();
        $('#africell_flagHolder').attr('class', '').addClass(className);
    }
    $('#africellAmount_sle').on('input', function () {
        if (window.countrySupported == 0) {
            var amt = parseFloat($('#africellAmount_sle').val());
            if (amt) {
                var charge = amt * 0.01 * parseFloat(window.mystats.forexObj.UG_forexPercentage);
                var fxamt = amt - charge;
                var toUSD = fxamt / parseFloat(window.mystats.forexObj.exchangeRateFrom);
                var toUGX = Math.floor(toUSD * parseFloat(window.mystats.forexObj.exchangeRateUG));
                $('#africellforexamount').html('UGX ' + numberWithCommas(toUGX));
            } else {
                $('#africellforexamount').html('UGX 0');
            }
        }
    });
});
//-----[UTL Airtime]
myApp.onPageInit('payutl', function (page) {
    var uobj = getuobj();
    className = "flag flag-" + uobj.countryCode.toLowerCase();
    if (window.countrySupported == 0) {
        $('#utl_forex_block').show();
        $('#utl_flagHolder').attr('class', '').addClass(className);
        $('#utlAmount_sle').attr('placeholder', 'Amount (' + uobj.currencyCode + ')');
    } else {
        $('#utl_forex_block').hide();
        $('#utl_flagHolder').attr('class', '').addClass(className);
    }
    $('#utlAmount_sle').on('input', function () {
        if (window.countrySupported == 0) {
            var amt = parseFloat($('#utlAmount_sle').val());
            if (amt) {
                var charge = amt * 0.01 * parseFloat(window.mystats.forexObj.UG_forexPercentage);
                var fxamt = amt - charge;
                var toUSD = fxamt / parseFloat(window.mystats.forexObj.exchangeRateFrom);
                var toUGX = Math.floor(toUSD * parseFloat(window.mystats.forexObj.exchangeRateUG));
                $('#utlforexamount').html('UGX ' + numberWithCommas(toUGX));
            } else {
                $('#utlforexamount').html('UGX 0');
            }
        }
    });
});
//-----[Afrimax Airtime]
myApp.onPageInit('payafrimax', function (page) {
    var uobj = getuobj();
    className = "flag flag-" + uobj.countryCode.toLowerCase();
    if (window.countrySupported == 0) {
        $('#afrimax_forex_block').show();
        $('#afrimax_flagHolder').attr('class', '').addClass(className);
        $('#afrimaxAmount_sle').attr('placeholder', 'Amount (' + uobj.currencyCode + ')');
    } else {
        $('#afrimax_forex_block').hide();
        $('#afrimax_flagHolder').attr('class', '').addClass(className);
    }
    $('#afrimaxAmount_sle').on('input', function () {
        if (window.countrySupported == 0) {
            var amt = parseFloat($('#afrimaxAmount_sle').val());
            if (amt) {
                var charge = amt * 0.01 * parseFloat(window.mystats.forexObj.UG_forexPercentage);
                var fxamt = amt - charge;
                var toUSD = fxamt / parseFloat(window.mystats.forexObj.exchangeRateFrom);
                var toUGX = Math.floor(toUSD * parseFloat(window.mystats.forexObj.exchangeRateUG));
                $('#afrimaxforexamount').html('UGX ' + numberWithCommas(toUGX));
            } else {
                $('#afrimaxforexamount').html('UGX 0');
            }
        }
    });
});
//-----[Smile Airtime]
myApp.onPageInit('paysmile', function (page) {
    var uobj = getuobj();
    className = "flag flag-" + uobj.countryCode.toLowerCase();
    if (window.countrySupported == 0) {
        $('#smile_forex_block').show();
        $('#smile_flagHolder').attr('class', '').addClass(className);
        $('#smileAmount_sle').attr('placeholder', 'Amount (' + uobj.currencyCode + ')');
    } else {
        $('#smile_forex_block').hide();
        $('#smile_flagHolder').attr('class', '').addClass(className);
    }
    $('#smileAmount_sle').on('input', function () {
        if (window.countrySupported == 0) {
            var amt = parseFloat($('#smileAmount_sle').val());
            if (amt) {
                var charge = amt * 0.01 * parseFloat(window.mystats.forexObj.UG_forexPercentage);
                var fxamt = amt - charge;
                var toUSD = fxamt / parseFloat(window.mystats.forexObj.exchangeRateFrom);
                var toUGX = Math.floor(toUSD * parseFloat(window.mystats.forexObj.exchangeRateUG));
                $('#smileforexamount').html('UGX ' + numberWithCommas(toUGX));
            } else {
                $('#smileforexamount').html('UGX 0');
            }
        }
    });
});

//-----[Smart Airtime]
myApp.onPageInit('paysmart', function (page) {
    var uobj = getuobj();
    className = "flag flag-" + uobj.countryCode.toLowerCase();
    if (window.countrySupported == 0) {
        $('#smart_forex_block').show();
        $('#smart_flagHolder').attr('class', '').addClass(className);
        $('#smartAmount_sle').attr('placeholder', 'Amount (' + uobj.currencyCode + ')');
    } else {
        $('#smart_forex_block').hide();
        $('#smart_flagHolder').attr('class', '').addClass(className);
    }
    $('#smartAmount_sle').on('input', function () {
        if (window.countrySupported == 0) {
            var amt = parseFloat($('#smartAmount_sle').val());
            if (amt) {
                var charge = amt * 0.01 * parseFloat(window.mystats.forexObj.UG_forexPercentage);
                var fxamt = amt - charge;
                var toUSD = fxamt / parseFloat(window.mystats.forexObj.exchangeRateFrom);
                var toUGX = Math.floor(toUSD * parseFloat(window.mystats.forexObj.exchangeRateUG));
                $('#smartforexamount').html('UGX ' + numberWithCommas(toUGX));
            } else {
                $('#smartforexamount').html('UGX 0');
            }
        }
    });
});

//-----[DSTV]
myApp.onPageInit('paydstv', function (page) {
    var uobj = getuobj();
    className = "flag flag-" + uobj.countryCode.toLowerCase();
    if (window.countrySupported == 0) {
        $('#dstvinet_forex_block').show();
        $('#dstvinet_flagHolder').attr('class', '').addClass(className);
        $('#dstvinetAmount_sle').attr('placeholder', 'Amount (' + uobj.currencyCode + ')');
    } else {
        $('#dstvinet_forex_block').hide();
        $('#dstvinet_flagHolder').attr('class', '').addClass(className);
    }
    fetchPriceList('DSTV.Primary', '#picker-device', "Fetching DSTV packages...Please Wait");
});

//-----[GOTV]
myApp.onPageInit('paygotv', function (page) {
    var uobj = getuobj();
    className = "flag flag-" + uobj.countryCode.toLowerCase();
    if (window.countrySupported == 0) {
        $('#gotvinet_forex_block').show();
        $('#gotvinet_flagHolder').attr('class', '').addClass(className);
        $('#gotvinetAmount_sle').attr('placeholder', 'Amount (' + uobj.currencyCode + ')');
    } else {
        $('#gotvinet_forex_block').hide();
        $('#gotvinet_flagHolder').attr('class', '').addClass(className);
    }
    fetchPriceList('GOtv', '#picker-device-gotv', "Fetching GOtv packages...Please Wait");
});
//-----[REGISTER3 PAGE]
myApp.onPageInit('register3', function (page) {
    var request = {
        'controller': 'user',
        'action': 'fetchsecurityquestion'
    }
    myApp.showPreloader('Loading security questions...');
    window.MalipoMoneyAPI.queryApi(request, function (d) {
        myApp.hidePreloader();
        if (d.success == 1) {
            var str = '';
            for (var n = 0; n < d.data.length; n++) {
                str += "<option value=\"" + d.data[n].id + "\">" + d.data[n].qn + "</option>";
            }
            $('#qnsel').html(str);
        } else {
            myApp.alert(d.errormsg, 'Registration Error!');
        }
    }, function (e) {
        myApp.hidePreloader();
        myApp.alert(e, 'Registration Error!');
    });
});

//-----[Startimes]
myApp.onPageInit('paystartimes', function (page) {
    var uobj = getuobj();
    className = "flag flag-" + uobj.countryCode.toLowerCase();
    if (window.countrySupported == 0) {
        $('#startopup_forex_block').show();
        $('#startopup_flagHolder').attr('class', '').addClass(className);
        $('#startopupAmount_sle').attr('placeholder', 'Amount (' + uobj.currencyCode + ')');
    } else {
        $('#startopup_forex_block').hide();
        $('#startopup_flagHolder').attr('class', '').addClass(className);
    }
    $('#startopupAmount_sle').on('input', function () {
        if (window.countrySupported == 0) {
            var amt = parseFloat($('#startopupAmount_sle').val());
            if (amt) {
                var charge = amt * 0.01 * parseFloat(window.mystats.forexObj.UG_forexPercentage);
                var fxamt = amt - charge;
                var toUSD = fxamt / parseFloat(window.mystats.forexObj.exchangeRateFrom);
                var toUGX = Math.floor(toUSD * parseFloat(window.mystats.forexObj.exchangeRateUG));
                $('#startopupforexamount').html('UGX ' + numberWithCommas(toUGX));
            } else {
                $('#startopupforexamount').html('UGX 0');
            }
        }
    });
});

//-----[ZUKU ]
myApp.onPageInit('payzuku', function (page) {
    var uobj = getuobj();
    className = "flag flag-" + uobj.countryCode.toLowerCase();
    if (window.countrySupported == 0) {
        $('#zukutopup_forex_block').show();
        $('#zukutopup_flagHolder').attr('class', '').addClass(className);
        $('#zukutopupAmount_sle').attr('placeholder', 'Amount (' + uobj.currencyCode + ')');
    } else {
        $('#zukutopup_forex_block').hide();
        $('#zukutopup_flagHolder').attr('class', '').addClass(className);
    }
    $('#zukutopupAmount_sle').on('input', function () {
        if (window.countrySupported == 0) {
            var amt = parseFloat($('#zukutopupAmount_sle').val());
            if (amt) {
                var charge = amt * 0.01 * parseFloat(window.mystats.forexObj.UG_forexPercentage);
                var fxamt = amt - charge;
                var toUSD = fxamt / parseFloat(window.mystats.forexObj.exchangeRateFrom);
                var toUGX = Math.floor(toUSD * parseFloat(window.mystats.forexObj.exchangeRateUG));
                $('#zukutopupforexamount').html('UGX ' + numberWithCommas(toUGX));
            } else {
                $('#zukutopupforexamount').html('UGX 0');
            }
        }
    });
});

//-----[SMILE INET]
myApp.onPageInit('paysmileinet', function (page) {
    var uobj = getuobj();
    className = "flag flag-" + uobj.countryCode.toLowerCase();
    if (window.countrySupported == 0) {
        $('#smileinet_forex_block').show();
        $('#smileinet_flagHolder').attr('class', '').addClass(className);
        $('#smileinetAmount_sle').attr('placeholder', 'Amount (' + uobj.currencyCode + ')');
    } else {
        $('#smileinet_forex_block').hide();
        $('#smileinet_flagHolder').attr('class', '').addClass(className);
    }
    fetchPriceList('Smilecoms.DataBundle', '#smile-picker-device', "Fetching Smile Internet Bundles...Please Wait");
});

//-----[Africell INET]
myApp.onPageInit('payafricellinet', function (page) {
    var uobj = getuobj();
    className = "flag flag-" + uobj.countryCode.toLowerCase();
    if (window.countrySupported == 0) {
        $('#africellinet_forex_block').show();
        $('#africellinet_flagHolder').attr('class', '').addClass(className);
        $('#africellinetAmount_sle').attr('placeholder', 'Amount (' + uobj.currencyCode + ')');
    } else {
        $('#africellinet_forex_block').hide();
        $('#africellinet_flagHolder').attr('class', '').addClass(className);
    }
    fetchPriceList('OrangeInet', '#africell-picker-device', "Fetching Africell Internet Bundles...Please Wait");
});
//-----[RECOVER2]
myApp.onPageInit('recover2', function (page) {
    var request = {
        'controller': 'user',
        'action': 'fetchsecurityquestion'
    }
    myApp.showPreloader('Loading security questions...');
    window.MalipoMoneyAPI.queryApi(request, function (d) {
        myApp.hidePreloader();
        if (d.success == 1) {
            var str = '';
            for (var n = 0; n < d.data.length; n++) {
                str += "<option value=\"" + d.data[n].id + "\">" + d.data[n].qn + "</option>";
            }
            $('#rqnsel').html(str);
        } else {
            myApp.alert(d.errormsg, 'Recovery Error!');
        }
    }, function (e) {
        myApp.hidePreloader();
        myApp.alert(e, 'Recovery Error!');
    });
});



/*
window.onbeforeunload = function(e) {
SignOut();
}
 
$(document).on('contextmenu', function()
{
  return false;
});
$('*').mousedown(function(e)
{
  if (e.button == 2)
  {
    return false; // do nothing!
  }
});
Object.defineProperty(window, "console",
{
  value: console,
  writable: false,
  configurable: false
});
var i = 0;

function showWarningAndThrow()
{
  if (!i)
  {
    setTimeout(function()
    {
      console.log("%cWarning message", "font: 2em sans-serif; color: yellow; background-color: red;");
    }, 1);
    i = 1;
  }
  throw "Console is disabled";
}
var l, n = {
  set: function(o)
  {
    l = o;
  },
  get: function()
  {
    showWarningAndThrow();
    return l;
  }
};
Object.defineProperty(console, "_commandLineAPI", n);
Object.defineProperty(console, "__commandLineAPI", n);
window.console.log = function()
  {
    console.error('The developer console is temp...');
    window.console.log = function()
    {
      return false;
    }
  }
  (function()
  {
    try
    {
      var $_console$$ = console;
      Object.defineProperty(window, "console",
      {
        get: function()
        {
          if ($_console$$._commandLineAPI) throw "Sorry, for security reasons, the script console is deactivated on netflix.com";
          return $_console$$
        },
        set: function($val$$)
        {
          $_console$$ = $val$$
        }
      })
    }
    catch ($ignore$$)
    {}
  })();
if (window.webkitURL)
{
  var ish, _call = Function.prototype.call;
  Function.prototype.call = function()
  { //Could be wrapped in a setter for _commandLineAPI, to redefine only when the user started typing.
    if (arguments.length > 0 && this.name === "evaluate" && arguments[0].constructor.name === "InjectedScriptHost")
    { //If thisArg is the evaluate function and the arg0 is the ISH
      ish = arguments[0];
      ish.evaluate = function(e)
      { //Redefine the evaluation behaviour
        throw new Error('Rejected evaluation of: \n\'' + e.split('\n').slice(1, -1).join("\n") + '\'');
      };
      Function.prototype.call = _call; //Reset the Function.prototype.call
      return _call.apply(this, arguments);
    }
  };
}
})($, window);*/

// function padLeft(nr, n, str) {
//     return Array(n - String(nr).length + 1).join(str || '0') + nr;
// }

// var _LoadStatements = false;
// function LoadStatements(page, count) {
//     if (!_LoadStatements) {
//         _LoadStatements = true;
//         var uobj = getuobj();
//         var userid = uobj.epId;
//         var request = {
//             'controller': 'user',
//             'action': 'gettransferstatements',
//             'userid': userid,
//             'page': page,
//             'billerCode': '',
//             'count': count
//         }
//         myApp.showPreloader('Fetching transfer statements')
//         window.MalipoMoneyAPI.queryApi(request, function (d) {
//             myApp.hidePreloader();
//             _LoadStatements = false;
//             if (d.success) {
//                 var l = d.data.length;
//                 var str = "";
//                 for (var n = 0; n < l; n++) {
//                     var mode = "<i class='icon-left'><span style='display:none' lang='en'> " + "Received" + "<\/span><\/i>";
//                     var modeColor = 'background-color:#9CCA50;color:black;vertical-align:middle;padding:0px;';
//                     var ans = d.data[n];
//                     var name = ans.fromName;
//                     var phone = ans.fromPhone;
//                     cid = ans.fromId;
//                     var amount = "<span style='color:white'>" + number_format(Math.ceil(ans.amount)) + "<\/span>";
//                     // console.log(ans);
//                     if (parseInt(ans.billid) > 0) {
//                         mode = "<i class='icon-right'><span style='display:none'> " + "Sent" + "<\/span><\/i>";
//                         modeColor = 'background-color:#EABE3C;color:white;vertical-align:middle;padding:0px;';
//                         name = ans.toName;
//                         phone = ans.toPhone;
//                         _phone = phone;
//                         var amount = "<span style='color:white'>" + number_format(Math.ceil(ans.amount)) + "<\/span>";
//                     }
//                     else {
//                         if (ans.type == 'deposit') {
//                             //console.log(ans);
//                             var astyle = '';
//                             mode = "<i class='icon-left'><span style='display:none'> " + "Sent" + "<\/span><\/i>";
//                             modeColor = 'background-color:#9CCA50;color:black;vertical-align:middle;padding:0px';
//                             name = ans.toName;
//                             phone = ans.toPhone;
//                             _phone = ans.fromName + " Deposit. TXID: " + padLeft(ans.id, 8);
//                             //console.log(ans);
//                             var amount = "<span style='color:white'>" + number_format(Math.ceil(ans.amount)) + "<\/span>";
//                             if (ans.billerCode.length) { //(parseInt(ans.isMerchant) == 1) || (parseInt(ans.isSuperAgent) == 1) || (parseInt(ans.isCorporate) == 1)) {
//                                 name = ans.companyName;
//                                 _phone = ans.reason; //'Purchase from '+ans.billerName+"["+ans.billerCode+"]";
//                                 astyle = "color:green";
//                             }
//                         } else
//                             if (ans.type == 'forex') {
//                                 mode = "<i class='icon-right'><span style='display:none'> " + "Sent" + "<\/span><\/i>";
//                                 modeColor = 'background-color:#EABE3C;color:white;vertical-align:middle;padding:0px;';
//                                 name = "EasyPay Forex";
//                                 phone = '';
//                                 _phone = phone;
//                                 var amount = "<span style='color:white'>" + number_format(Math.ceil(ans.amount)) + "<\/span>";
//                             }
//                             else {
//                                 if (uobj.id == parseInt(ans.fromId)) {
//                                     var _phone = ans.toPhone;
//                                     var astyle = '';
//                                     mode = "<i class='icon-right'><span style='display:none'> " + "Sent" + "<\/span><\/i>";
//                                     modeColor = 'background-color:#EABE3C;;color:white;vertical-align:middle;padding:0px';
//                                     name = ans.toName;
//                                     phone = ans.toPhone;
//                                     var amount = "<span style='color:white'>" + number_format(Math.ceil(ans.amount)) + "<\/span>";
//                                     if (ans.billerCode.length) {
//                                         name = ans.companyName;
//                                         _phone = 'Purchase from ' + ans.billerName + "[" + ans.billerCode + "]";
//                                         astyle = "color:green";
//                                     }
//                                     else {
//                                         if (parseInt(ans.billid) == 0) {
//                                             name = ans.toName;
//                                             _phone = ans.toPhone;
//                                             if (ans.reason)
//                                             { }
//                                             else ans.reason = _phone;
//                                         }
//                                         astyle = "color:green";
//                                         if (ans.billerName) {
//                                             if (ans.billerName.length) {
//                                                 _phone = 'Cashier: ' + ans.billerName + "[" + ans.billerCode + "]";
//                                             }
//                                         }
//                                     }
//                                 }
//                                 else {
//                                     var mode = "<i class='icon-left'><span style='display:none' lang='en'> " + "Received" + "<\/span><\/i>";
//                                     var modeColor = 'background-color:#9CCA50;color:white;vertical-align:middle;padding:0px';
//                                     //var ans = d.data[n];
//                                     //console.log(ans);
//                                     name = ans.toName;
//                                     phone = ans.toPhone;
//                                     _phone = ans.toPhone;
//                                     amount = "<span style='color:white'>" + number_format(Math.ceil(ans.amount)) + "<\/span>";
//                                     if (ans.billerCode.length) {
//                                         //	console.log(ans);
//                                         name = ans.fromName;
//                                         _phone = 'Purchase. Cashier: ' + ans.billerName + "[" + ans.billerCode + "]";
//                                         astyle = "color:green";
//                                     }
//                                 }
//                             }
//                     }
//                     if (parseInt(ans.billid) > 0) {
//                         if (ans.billphone.length) {
//                             _phone += "<br/><span style='color:#F0701B;'>Paid for <b>" + ans.billphone + "</b></span>";
//                         }
//                         // str += "<tr class='thin'  style='cursor:pointer'><td scope=\"row\"  style='" + astyle + "'>" + name +
//                         // "&nbsp;<br><small class='gray'>" + _phone + "<\/small><\/td><td>" + ans.time + "<\/td><td style='" +
//                         // modeColor + "' valign='middle' >" + mode + "<\/td><td><b>" + amount + "<\/b><\/td><\/tr>";
//                         if (ans.reason)
//                         { }
//                         else ans.reason = _phone;
//                         str += "<tr class='thin' style='" + modeColor + "' onclick=\"\" ><td scope=\"row\"  style='" + astyle +
//                             ";background:#F5FDC8;color:black;border-bottom:1px solid silver;line-height:1;padding-top:5px;padding-bottom:5px;padding-left:10px;cursor:pointer'><span style='font-size:14px;color:#797878;font-weight:bold'>" +
//                             name + "</span><br\/>\n<small style='color:#CC6F4B;;font-size:12px'><i>&quot;" + ans.reason +
//                             "&quot;</i></small><br/>\n<small style='color:#333333;font-size:12px;border-right:none;text-shadow:none'>TxID: " +
//                             padLeft(ans.id, 8) + "</small><br/>\n<small style='color:black;font-size:12px'>" + ans.time +
//                             "</small><\/td><td style='cursor:pointer;border-bottom:1px silver solid;line-height:1;border-left:none;padding:5px;padding-bottom:5px;'><b style='text-shadow:1px 1px 2px rgba(0, 0, 0, 0.69);'>" +
//                             amount + "<\/b><\/td><\/tr>";
//                     } else
//                         if (ans.type == 'forex') {
//                             str += "<tr class='thin' style='" + modeColor + "' onclick=\"\" ><td scope=\"row\"  style='" + astyle +
//                                 ";background:#F5FDC8;color:black;border-bottom:1px solid silver;line-height:1;padding-top:5px;padding-bottom:5px;padding-left:10px;cursor:pointer'><span style='font-size:14px;color:#797878;font-weight:bold'>" +
//                                 name + "</span><br\/>\n<small style='color:#CC6F4B;;font-size:12px'><i>&quot;" + ans.reason +
//                                 "&quot;</i></small><br/>\n<small style='color:#333333;font-size:12px;border-right:none;text-shadow:none'>TxID: " +
//                                 padLeft(ans.id, 8) + "</small><br/>\n<small style='color:black;font-size:12px'>" + ans.time +
//                                 "</small><\/td><td style='cursor:pointer;border-bottom:1px silver solid;line-height:1;border-left:none;padding:5px;padding-bottom:5px;'><b style='text-shadow:1px 1px 2px rgba(0, 0, 0, 0.69);'>" +
//                                 amount + "<\/b><\/td><\/tr>";
//                         }
//                         else {
//                             if (ans.reason)
//                             { }
//                             else ans.reason = _phone;
//                             str += "<tr class='thin' style='" + modeColor + "'  ><td scope=\"row\"  style='" + astyle +
//                                 ";background:#F5FDC8;color:black;;border-bottom:1px solid gray;line-height:1;padding-top:5px;padding-bottom:5px;padding-left:10px;cursor:pointer'><span style='font-size:14px;color:#797878;font-weight:bold'>" +
//                                 name + "</span><br\/>\n<small style='color:#CC6F4B;;font-size:12px'><i>&quot;" + ans.reason +
//                                 "&quot;</i></small><br/>\n<small style='color:#333333;font-size:12px;border-right:none;text-shadow:none'>TxID: " +
//                                 padLeft(ans.id, 8) + "</small><br/>\n<small style='color:black;font-size:12px'>" + ans.time +
//                                 "</small><\/td><td style='cursor:pointer;border-bottom:1px silver solid;line-height:1;border-left:none;padding:5px;padding-bottom:5px;'><b style='text-shadow:1px 1px 2px rgba(0, 0, 0, 0.69);'>" +
//                                 amount + "<\/b><\/td><\/tr>";
//                             //str += "<tr class='thin' onclick=\"SendToUser('" + name + "','" + phone + "'," + ans.isMerchant + "," + ans.isCorporate + "," + ans.isSuperAgent + ")\" style='cursor:pointer'><td scope=\"row\"  style='" + astyle + "'>" + name + "&nbsp;<br><small class='gray'>" + _phone + "<\/small><br\/><small style='color:orange'><i>&quot;"+ans.reason+"&quot;</i></small><\/td><td>" + ans.time + "<\/td><td style='" + modeColor + "' valign='middle' >" + mode + "<\/td><td><b>" + amount + "<\/b><\/td><\/tr>";
//                         }
//                 }
//                 if (str.length == 0) str = "<tr><td colspan='2' style='color:white;text-align:center'>" + "No statements to show." + "<\/td><\/tr>";
//                 $('#transferlist').html(str);

//                 $('#table_statements').show();
//                 var pagecount = Math.ceil(d.total / count);
//                 var prev = "";
//                 var next = "";
//                 if (page > 1) {
//                     prev = "<a href=\"javascript:void(0)\" onclick=\"LoadStatements(" + (page - 1) + "," + count +
//                         ")\" class=\"button button-big button-fill\" style='background-color:#F0701B;;box-shadow: 0 3px 3px rgba(0,0,0,.19),0 2px 2px rgba(0,0,0,.23)'>" +
//                         "<span ><span class=\"icon-left\"><\/span><\/span>  " + "Previous" + "<\/a>";
//                 }
//                 else {
//                     prev =
//                         "<a href=\"javascript:void(0)\" onclick=\"\" class=\"button button-big button-fill\" style='background-color:#404042;;box-shadow: 0 3px 3px rgba(0,0,0,.19),0 2px 2px rgba(0,0,0,.23)' >" +
//                         "<span ><span class=\"icon-left\"><\/span><\/span>  " + "Previous" + "<\/a>";
//                 }
//                 if (page < pagecount && page > 0) {
//                     next = "<a href=\"javascript:void(0)\" onclick=\"LoadStatements(" + (page + 1) + "," + count +
//                         ")\" class=\"button button-big button-fill\" style='background-color:#F0701B;;box-shadow: 0 3px 3px rgba(0,0,0,.19),0 2px 2px rgba(0,0,0,.23)'>" +
//                         "Next" + "  <span ><span class=\"icon-right\"><\/span><\/span><\/a>";
//                 }
//                 else {
//                     next =
//                         "<a href=\"javascript:void(0)\" onclick=\"\" class=\"button button-big button-fill\" style='background-color:#404042;;box-shadow: 0 3px 3px rgba(0,0,0,.19),0 2px 2px rgba(0,0,0,.23)'>" +
//                         "Next" + "  <span ><span class=\"icon-right\"><\/span><\/span><\/a>";
//                 }
//                 var xstr = "<div class=\"row\"><div class=\"col-50\">" + prev + "</div><div class=\"col-50\">" + next + "</div></div> ";
//                 $('#spaginator').html(xstr);
//             }
//         }, function (e) { _LoadStatements = false; })
//     }
// }

// var _LoadCommissionStatements = false;
// function LoadCommissionStatements(page, count) {
//     if (!_LoadCommissionStatements) {
//         _LoadCommissionStatements = true;
//         var uobj = getuobj();
//         var userid = uobj.epId;
//         var billerCode = '';
//         var request = {
//             'controller': 'user',
//             'action': 'getcommissions',
//             'userid': userid,
//             'page': page,
//             'billerCode': billerCode,
//             'count': count
//         }
//         myApp.showPreloader('Fetching commissions report')
//         window.MalipoMoneyAPI.queryApi(request, function (d) {
//             myApp.hidePreloader();
//             _LoadCommissionStatements = false;
//             if (d.success) {
//                 var l = d.data.length;
//                 var str = "";
//                 for (var n = 0; n < l; n++) {
//                     var mode = "<i class='icon-left'><span style='display:none' lang='en'> " + "Received" + "<\/span><\/i>";
//                     var modeColor = 'background-color:#7ED43D;color:white;vertical-align:middle;padding:0px';
//                     var ans = d.data[n];
//                     var name = ans.fromName;
//                     var phone = ans.fromPhone;
//                     cid = ans.fromId;
//                     var amount = "<span style='color:white'>" + number_format(Math.ceil(ans.amount)) + "<\/span>";
//                     if (parseInt(ans.billid) > 0) {
//                         mode = "<i class='icon-right'><span style='display:none'> " + "Sent" + "<\/span><\/i>";
//                         modeColor = 'background-color:#FFA83C;color:white;vertical-align:middle;padding:0px';
//                         name = ans.toName;
//                         phone = ans.toPhone;
//                         _phone = phone;
//                         var amount = "<span style='color:white'>" + number_format(Math.ceil(ans.amount)) + "<\/span>";
//                     }
//                     else {
//                         if (ans.type == 'deposit') {
//                             //console.log(ans);
//                             var astyle = '';
//                             mode = "<i class='icon-left'><span style='display:none'> " + "Sent" + "<\/span><\/i>";
//                             modeColor = 'background-color:#7ED43D;color:white;vertical-align:middle;padding:0px';
//                             name = ans.toName;
//                             phone = ans.toPhone;
//                             _phone = ans.fromName + " Deposit. TXID: " + padLeft(ans.id, 8);
//                             //console.log(ans);
//                             var amount = "<span style='color:white'>" + number_format(Math.ceil(ans.amount)) + "<\/span>";
//                             if (ans.billerCode.length) { //(parseInt(ans.isMerchant) == 1) || (parseInt(ans.isSuperAgent) == 1) || (parseInt(ans.isCorporate) == 1)) {
//                                 name = ans.companyName;
//                                 _phone = ans.reason; //'Purchase from '+ans.billerName+"["+ans.billerCode+"]";
//                                 astyle = "color:green";
//                             }
//                         }
//                         else {
//                             if (uobj.id == parseInt(ans.fromId)) {
//                                 var _phone = ans.toPhone;
//                                 var astyle = '';
//                                 mode = "<i class='icon-right'><span style='display:none'> " + "Sent" + "<\/span><\/i>";
//                                 modeColor = 'background-color:#FFA83C;color:white;vertical-align:middle;padding:0px';
//                                 name = ans.toName;
//                                 phone = ans.toPhone;
//                                 var amount = "<span style='color:white'>" + number_format(Math.ceil(ans.amount)) + "<\/span>";
//                                 if (ans.billerCode.length) {
//                                     name = ans.companyName;
//                                     _phone = 'Purchase from ' + ans.billerName + "[" + ans.billerCode + "]";
//                                     astyle = "color:green";
//                                 }
//                                 else {
//                                     if (parseInt(ans.billid) == 0) {
//                                         name = ans.toName;
//                                         _phone = ans.toPhone;
//                                         if (ans.reason)
//                                         { }
//                                         else ans.reason = _phone;
//                                     }
//                                     astyle = "color:green";
//                                     if (ans.billerName) {
//                                         if (ans.billerName.length) {
//                                             _phone = 'Cashier: ' + ans.billerName + "[" + ans.billerCode + "]";
//                                         }
//                                     }
//                                 }
//                             }
//                             else {
//                                 var mode = "<i class='icon-left'><span style='display:none' lang='en'> " + "Received" + "<\/span><\/i>";
//                                 var modeColor = 'background-color:#7ED43D;color:white;vertical-align:middle;padding:0px';
//                                 //var ans = d.data[n];
//                                 //console.log(ans);
//                                 name = ans.toName;
//                                 phone = ans.toPhone;
//                                 _phone = ans.toPhone;
//                                 amount = "<span style='color:white'>" + number_format(Math.ceil(ans.amount)) + "<\/span>";
//                                 if (ans.billerCode.length) {
//                                     //	console.log(ans);
//                                     name = ans.fromName;
//                                     _phone = 'Purchase. Cashier: ' + ans.billerName + "[" + ans.billerCode + "]";
//                                     astyle = "color:green";
//                                 }
//                             }
//                         }
//                     }
//                     if (parseInt(ans.billid) > 0) {
//                         if (ans.billphone.length) {
//                             _phone += "<br/><span style='color:orange'>Paid for <b>" + ans.billphone + "</b></span>";
//                         }
//                         str += "<tr class='thin'  style='cursor:pointer'><td scope=\"row\"  style='" + astyle + "'>" + name +
//                             "&nbsp;<br><small class='gray'>" + _phone + "<\/small><\/td><td>" + ans.time + "<\/td><td style='" + modeColor +
//                             "' valign='middle' >" + mode + "<\/td><td><b>" + amount + "<\/b><\/td><\/tr>";
//                     }
//                     else {
//                         if (ans.reason)
//                         { }
//                         else ans.reason = _phone;
//                         str += "<tr class='thin' style='" + modeColor + "' onclick=\"ContactClicked('" + name + "','" + _phone +
//                             "');\" ><td scope=\"row\"  style='" + astyle +
//                             ";background:#F5FDC8;color:black;;border-bottom:1px solid gray;line-height:1;padding-top:5px;padding-bottom:5px;padding-left:10px;cursor:pointer'><span style='font-size:14px;color:#797878;font-weight:bold'>" +
//                             name + "</span><br\/>\n<small style='color:#F0701B;;font-size:10px'><i>&quot;" + ans.reason +
//                             "&quot;</i></small><br/>\n<small style='color:#333333;font-size:12px;border-right:none;text-shadow:none'>TxID: " +
//                             padLeft(ans.id, 8) + "</small><br/>\n<small style='color:black;font-size:12px'>" + ans.time +
//                             "</small><\/td><td style='cursor:pointer;border-bottom:1px silver solid;line-height:1;border-left:none;padding:5px;padding-bottom:5px;'><b style='text-shadow:1px 1px 2px rgba(0, 0, 0, 0.69);'>" +
//                             amount + "<\/b><\/td><\/tr>";
//                         //str += "<tr class='thin' onclick=\"SendToUser('" + name + "','" + phone + "'," + ans.isMerchant + "," + ans.isCorporate + "," + ans.isSuperAgent + ")\" style='cursor:pointer'><td scope=\"row\"  style='" + astyle + "'>" + name + "&nbsp;<br><small class='gray'>" + _phone + "<\/small><br\/><small style='color:orange'><i>&quot;"+ans.reason+"&quot;</i></small><\/td><td>" + ans.time + "<\/td><td style='" + modeColor + "' valign='middle' >" + mode + "<\/td><td><b>" + amount + "<\/b><\/td><\/tr>";
//                     }
//                 }
//                 if (str.length == 0) str = "<tr><td colspan='2' style='color:#333;text-align:center'>" + " No statements to show." + "<\/td><\/tr>";
//                 $('#commissions_transferlist').html(str);
//                 $('#commission_table').show();
//                 var pagecount = Math.ceil(d.total / count);
//                 var prev = "";
//                 var next = "";
//                 if (page > 1) {
//                     prev = "<a href=\"javascript:void(0)\" onclick=\"LoadCommissionStatements(" + (page - 1) + "," + count +
//                         ")\" class=\"button button-big button-fill\" style='background-color:#F0701B;;box-shadow: 0 3px 3px rgba(0,0,0,.19),0 2px 2px rgba(0,0,0,.23)'>" +
//                         "<span ><span class=\"icon-left\"><\/span><\/span>  " + "Previous" + "<\/a>";
//                 }
//                 else {
//                     prev =
//                         "<a href=\"javascript:void(0)\" onclick=\"\" class=\"button button-big button-fill\" style='background-color:#404042;;box-shadow: 0 3px 3px rgba(0,0,0,.19),0 2px 2px rgba(0,0,0,.23)' >" +
//                         "<span ><span class=\"icon-left\"><\/span><\/span>  " + "Previous" + "<\/a>";
//                 }
//                 if (page < pagecount && page > 0) {
//                     next = "<a href=\"javascript:void(0)\" onclick=\"LoadCommissionStatements(" + (page + 1) + "," + count +
//                         ")\" class=\"button button-big button-fill\" style='background-color:#F0701B;;box-shadow: 0 3px 3px rgba(0,0,0,.19),0 2px 2px rgba(0,0,0,.23)'>" +
//                         "Next" + "  <span ><span class=\"icon-right\"><\/span><\/span><\/a>";
//                 }
//                 else {
//                     next =
//                         "<a href=\"javascript:void(0)\" onclick=\"\" class=\"button button-big button-fill\"  style='background-color:#404042;;box-shadow: 0 3px 3px rgba(0,0,0,.19),0 2px 2px rgba(0,0,0,.23)'>" +
//                         "Next" + "  <span ><span class=\"icon-right\"><\/span><\/span><\/a>";
//                 }
//                 var xstr = "<div class=\"row\"><div class=\"col-50\">" + prev + "</div><div class=\"col-50\">" + next + "</div></div> ";
//                 $('#commissions_paginator').html(xstr);
//                 $('#cc_thisWeek').html("UGX " + number_format(d.thisWeek));
//                 $('#cc_thisMonth').html("UGX " + number_format(d.thisMonth));
//                 $('#cc_thisYear').html("UGX " + number_format(d.thisYear));
//             }
//         }, function (e) { _LoadCommissionStatements = false; })
//     }
// }


// function RecoverStep1() {
//     var phone = $.trim($('#phone-recover').val()),
//         email = $.trim($('#email-recover').val());
//     if (phone.length === 0) {
//         myApp.alert('Please enter your phone number eg 25677... or simply 077..', 'Recovery Error!');
//         return false;
//     }
//     if (email.length == 0) {
//         myApp.alert('Please enter a valid email address', 'Recovery Error!');
//         return false;
//     }
//     if (!isValidEmail(email)) {
//         myApp.alert('Please enter a valid email address', 'Recovery Error!');
//         return false;
//     }
//     if (checkPhoneNumberStrict(phone) == -1) {
//         myApp.alert('Please enter a valid phone number with country code of 256!', 'Recovery Error!');
//         return false;
//     }
//     phone = checkPhoneNumberStrict(phone);
//     phone = phone.countryCode + phone.areaCode + phone.number;
//     var request = {
//         'controller': 'user',
//         'action': 'verifyrecoveryuser',
//         'phone': phone,
//         'email': email
//     }
//     window.RecObj = { 'email': email, 'phone': phone }
//     myApp.showPreloader('Verifying your information')
//     window.MalipoMoneyAPI.queryApi(request, function (d) {
//         myApp.hidePreloader();
//         if (d.success == 1) {
//             window.RecObj.userid = d.data;
//             mainView.router.loadPage('recover2.html');
//         } else {
//             myApp.alert(d.errormsg, 'Recovery Error!');
//         }
//     }, function (e) {
//         myApp.hidePreloader();
//         myApp.alert(e, 'Recovery Error!');
//     });
// }

// function RecoverStep2() {
//     answer = $('#rqn-register').val();
//     qnid = $('#rqnsel').val();
//     if (answer.length === 0) {
//         myApp.alert('Please fill in the answer to the security question you selected.', 'Recovery Error!');
//         return false;
//     }
//     var request = {
//         'controller': 'user',
//         'action': 'verifyrecoveryqn',
//         'userid': window.RecObj.userid,
//         'qnid': qnid,
//         'answer': answer
//     }
//     myApp.showPreloader('Verifying your security information')
//     window.MalipoMoneyAPI.queryApi(request, function (d) {
//         myApp.hidePreloader();
//         if (d.success == 1) {
//             mainView.router.loadPage('recover3.html');
//         } else {
//             myApp.alert(d.errormsg, 'Recovery Error!');
//         }
//     }, function (e) {
//         myApp.hidePreloader();
//         myApp.alert(e, 'Recovery Error!');
//     });
// }

// function RecoverStep3() {
//     phone = window.RecObj.phone;
//     var request = {
//         'controller': 'user',
//         'action': 'sendmissedcall',
//         'phone': phone
//     }
//     myApp.showPreloader('Sending missed call');
//     window.MalipoMoneyAPI.queryApi(request, function (d) {
//         myApp.hidePreloader();
//         if (d.success == 1) {
//             //console.log(d);
//             var start_num = d.data.otp_start;
//             var keymatch = d.data.id;
//             myApp.prompt('What are the last four digits of the missed call?', function (value) {
//                 if (value.length == 0) {
//                     myApp.alert("Empty field", 'Recovery Error!');
//                     return;
//                 }
//                 var request = {
//                     'controller': 'user',
//                     'action': 'verifymissedcall',
//                     'id': keymatch,
//                     'pin': value
//                 }
//                 //console.log(request);
//                 myApp.showPreloader('Verifying...');
//                 window.MalipoMoneyAPI.queryApi(request, function (d) {
//                     myApp.hidePreloader();
//                     if (d.success == 1) {
//                         var request = {
//                             'controller': 'user',
//                             'action': 'recoveracc',
//                             'userid': window.RecObj.userid
//                         }
//                         myApp.showPreloader('Sending Email with Recovery Link...');
//                         window.MalipoMoneyAPI.queryApi(request, function (d) {
//                             myApp.hidePreloader();
//                             if (d.success == 1) {
//                                 // console.log(d);
//                                 myApp.alert(
//                                     "An email containing a link on how to reset your PIN has been sent to your email.",
//                                     'Success!', function () {
//                                         mainView.router.loadPage('index.html');
//                                     });
//                             }
//                             else {
//                                 myApp.alert(d.errormsg, 'Recovery Error!');
//                             }
//                         }, function (e) {
//                             myApp.hidePreloader();
//                             myApp.alert(e, 'Recovery Error!');
//                         })
//                     }
//                     else {
//                         myApp.alert(d.errormsg, 'Recovery Error!');
//                     }
//                 }, function (e) {
//                     myApp.hidePreloader();
//                     myApp.alert(e, 'Recovery Error!');
//                 });
//             });
//         }
//         else {
//             myApp.alert(d.errormsg, 'Recovery Error!');
//         }
//     }, function (e) {
//         //console.log(e);
//         myApp.hidePreloader();
//         myApp.alert(e, 'Recovery Error!');
//     });
// }

// function LoginUser() {
//     var phone = $.trim($('#login').val()),
//         pin = $.trim($('#pin').val());
//     if (phone.length == 0) {
//         myApp.alert('Please enter a valid phone number with country code of 256!', 'Login Error!');
//         return false;
//     }
//     if (checkPhoneNumberStrict(phone) == -1) {
//         myApp.alert('Please enter a valid phone number with country code of 256!', 'Login Error!');
//         return false;
//     }

//     if (pin.length === 0) {
//         myApp.alert('Please fill in your PIN. Your PIN is 6 digits long or more', 'Login Error!');
//         return false;
//     }
//     if (!checkPin(pin)) {
//         myApp.alert('Please fill in your PIN. Your PIN is 6 digits long or more', 'Login Error!');
//         return false;
//     }
//     phone = checkPhoneNumberStrict(phone);
//     phone = phone.countryCode + phone.areaCode + phone.number;
//     var request = {
//         'controller': 'user',
//         'action': 'loginuser',
//         'phone': phone,
//         'pin': pin
//     }
//     //console.log(request);
//     myApp.showIndicator();
//     window.MalipoMoneyAPI.queryApi(request, function (d) {
//         myApp.hideIndicator();
//         console.log(d);
//         if (d.success == 1) {
//             hideuobj(d.data);
//             localStorage.setItem('UserAuthenticated', _pb_encode64(genPositive()));
//             if (isAndroid) {
//                 $('#login_in').css('margin-top', '56px');
//             } else {
//                 $('#login_in').css('margin-top', '20px');
//             }
//             $('#topname').html('Dashboard');
//             $('#login_top').css('margin-top', '40px');
//             $('#login_logo').hide();
//             $('#login_out').hide();
//             $('#login_in').show();
//             $('#panelloginout').hide();
//             $('#panelloginin').show();
//             if (myApp) {
//                 myApp.closePanel();
//                 mainView.hideToolbar();
//             }
//             LoadUser();
//         }
//         else {
//             myApp.alert(d.errormsg, 'Login Error!');
//         }
//     }, function (e) {
//         myApp.hideIndicator();
//         myApp.alert(e, 'Login Error!');
//         $('#pin').val('');
//         $('#login').val('');
//     });
// }

// function LoadUser() {
//     var uobj = getuobj();
//     className = "flag flag-" + uobj.countryCode.toLowerCase();
//     window.defaultFlagClass = className;
//     $('#flagHolder').attr('class', '').addClass(className);
//     $('#currencyHolder').html(uobj.currencyCode);
//     $('#acname').html(uobj.name);
//     var request = {
//         'controller': 'user',
//         'action': 'getbalance',
//         'phone': uobj.phone
//     }
//     //console.log(request);
//     window.MalipoMoneyAPI.queryApi(request, function (d) {
//         window.mystats = d.data.stats;
//         //console.log(d);
//         if (d.success == 1) {
//             $('#balance').html(number_format(Math.round(d.data.balance)));
//             if (window.mystats.billsSupported == 0) {
//                 $('.notsupportedcountry').css('display', 'none');
//                 window.countrySupported = 0;
//                 window.sendCountryWarning = d.data.sendWarning;
//             } else {
//                 window.countrySupported = 1;
//                 $('.notsupportedcountry').show();
//                 if (uobj.countryCode != 'UG') {
//                     $('.onlyug').hide();
//                 }
//             }


//         }
//     }, function (e) { console.log(e); });
// }

// function RegisterStep1() {
//     var name = $.trim($('#name-register').val()),
//         phone = $.trim($('#phone-register').val()),
//         pin1 = $.trim($('#pass-register').val()),
//         pin2 = $.trim($('#pass-register2').val());
//     email = $.trim($('#email-register').val());
//     referer = $.trim($('#referer').val());
//     lname = name.toLowerCase();
//     var regex = /^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$/;
//     // Check inputs
//     if (name.length === 0) {
//         myApp.alert('Please fill in your name, first and surname eg John Smith', 'Registration Error!');
//         return false;
//     }
//     else
//         if (!regex.test(lname)) {
//             myApp.alert('Invalid Name. Please enter your full name in english, first and surname eg John Smith', 'Registration Error!');
//             return false;
//         }
//     var passed = true;
//     var names = lname.split(" ");
//     var vowelRegex = /^(?!.*?[^aeiou]{5})(?!.*?[aeiou]{3})[a-z]*$/;
//     for (var n = 0; n < names.length; n++) {
//         //console.log(names[n] +" "+vowelRegex.test(names[n]));
//         if (!vowelRegex.test(names[n])) passed = false;
//     }
//     if (passed == false) {
//         myApp.alert('Invalid Name. Please enter your full name in english, first and surname eg John Smith', 'Registration Error!');
//         return false;
//     }
//     if (phone.length === 0) {
//         myApp.alert('Please enter your phone number including country code 2g 256xxxxxxxxx', 'Registration Error!');
//         return false;
//     }
//     else
//         if (email.length == 0) {
//             myApp.alert('Please enter a valid email address', 'Registration Error!');
//             return false;
//         }
//         else
//             if (!isValidEmail(email)) {
//                 myApp.alert('Please enter a valid email address', 'Registration Error!');
//                 return false;
//             }
//     if (pin1.length === 0) {
//         myApp.alert('Please fill in your PIN. Your PIN is 6 digits long or more eg 123456', 'Registration Error!');
//         return false;
//     }
//     else if (pin2.length === 0) {
//         myApp.alert('Please confirm your PIN. Your PIN is 6 digits long or more eg 123456', 'Registration Error!');
//         return false;
//     }
//     else
//         if (!checkRegPin(pin1)) {
//             myApp.alert('Please fill in your PIN. Your PIN is 6 digits long or more eg 123456', 'Registration Error!');
//             return false;
//         }
//         else
//             if (!checkRegPin(pin2)) {
//                 myApp.alert('Please confirm your PIN. Your PIN is 6 digits long or more eg 123456', 'Registration Error!');
//                 return false;
//             }
//     if (pin1 != pin2) {
//         myApp.alert('The PIN numbers do not match!', 'Registration Error!');
//         return false;
//     }
//     if (checkPhoneNumberStrict(phone) == -1) {
//         myApp.alert('Please enter a valid phone number with country code', 'Registration Error!');
//         return false;
//     }
//     phone = checkPhoneNumberStrict(phone);
//     nphone = phone.countryCode + phone.areaCode + phone.number;

//     var request = {
//         'controller': 'user',
//         'action': 'verifyuser',
//         'phone': nphone,
//         'email': email,
//         'referer': ''
//     }
//     window.RegObj = { 'name': name, 'email': email, 'phone': nphone, 'referer': '', 'pin': pin1 }
//     myApp.showPreloader('Verifying your information')
//     window.MalipoMoneyAPI.queryApi(request, function (d) {
//         myApp.hidePreloader();
//         if (d.success == 1) {
//             if (d.data == 'register') {
//                 mainView.router.loadPage('register2.html');
//             } else
//                 if (d.data == 'link') {
//                     myApp.prompt('We have detected that this phone number already exists on the EasyPay wallet. Please enter your EasyPay Pin to proceed.', 'SpinApp Registration', function (value) {
//                         var request = {
//                             'controller': 'user',
//                             'action': 'linkaccount',
//                             'phone': nphone,
//                             'pin': value
//                         }
//                         //console.log(request);
//                         myApp.showPreloader('Verifying your easypay wallet account');
//                         window.MalipoMoneyAPI.queryApi(request, function (d) {
//                             myApp.hidePreloader();
//                             if (d.success == 1) {
//                                 hideuobj(d.data);
//                                 localStorage.setItem('UserAuthenticated', _pb_encode64(genPositive()));
//                                 LoadUser();
//                                 mainView.router.loadPage('index.html');
//                             }
//                             else {
//                                 myApp.alert(d.errormsg, 'Registration Error!');
//                             }
//                         }, function (e) {
//                             myApp.hidePreloader();
//                             myApp.alert(e, 'Registration Error!');
//                         });

//                     });
//                 }

//         } else {
//             myApp.alert(d.errormsg, 'Registration Error!');
//         }
//     }, function (e) {
//         myApp.hidePreloader();
//         myApp.alert(e, 'Registration Error!');
//     });
// }

// function RegisterStep2() {
//     phone = window.RegObj.phone;
//     var request = {
//         'controller': 'user',
//         'action': 'sendmissedcall',
//         'phone': phone
//     }
//     myApp.showPreloader('Sending missed call');
//     window.MalipoMoneyAPI.queryApi(request, function (d) {
//         myApp.hidePreloader();
//         if (d.success == 1) {
//             var start_num = d.data.otp_start;
//             var keymatch = d.data.id;
//             myApp.prompt('What are the last four digits of the missed call?', 'SpinApp Registration', function (value) {
//                 var request = {
//                     'controller': 'user',
//                     'action': 'verifymissedcall',
//                     'id': keymatch,
//                     'pin': value
//                 }
//                 //console.log(request);
//                 myApp.showPreloader('Verifying...');
//                 window.MalipoMoneyAPI.queryApi(request, function (d) {
//                     myApp.hidePreloader();
//                     if (d.success == 1) {
//                         mainView.router.loadPage('register3.html');
//                     }
//                     else {
//                         myApp.alert(d.errormsg, 'Registration Error!');
//                     }
//                 }, function (e) {
//                     myApp.hidePreloader();
//                     myApp.alert(e, 'Registration Error!');
//                 });
//             });
//         }
//         else {
//             myApp.alert(d.errormsg, 'Registration Error!');
//         }
//     }, function (e) {
//         //console.log(e);
//         myApp.hidePreloader();
//         myApp.alert(e, 'Registration Error!');
//     });
// }


// function RegisterStep3() {
//     answer = $('#qn-register').val();
//     qnid = $('#qnsel').val();
//     if (answer.length === 0) {
//         myApp.alert('Please fill in the answer to the security question you selected.', 'Registration Error!');
//         return false;
//     }
//     var request = {
//         'controller': 'user',
//         'action': 'createuser',
//         'name': window.RegObj.name,
//         'phone': window.RegObj.phone,
//         'pin': window.RegObj.pin,
//         'email': window.RegObj.email,
//         'question_id': qnid,
//         'answer': answer
//     }
//     //mainView.router.loadPage('index.html');

//     if (window.hasRegistered == false) {
//         window.hasRegistered = true;
//         myApp.showPreloader('Creating Account...');
//         window.MalipoMoneyAPI.queryApi(request, function (d) {
//             myApp.hidePreloader();
//             if (d.success == 1) {
//                 //redirect to dashboard
//                 hideuobj(d.data);
//                 localStorage.setItem('UserAuthenticated', _pb_encode64(genPositive()));
//                 LoadUser();
//                 mainView.router.loadPage('index.html');
//             }
//         }, function (e) {
//             myApp.hidePreloader();
//             myApp.alert(e, 'Registration Error!');
//             window.hasRegistered = false;
//         });

//     }
// }

// function ShowRefillMenu() {
//     var uobj = getuobj();
//     if (uobj.countryCode == 'UG') {
//         var buttons = [

//             {
//                 text: "<span style='color:#cd1e21'>Mobile</span> <span style='color:#000'>Money</span>",
//                 onClick: function () {
//                     mainView.router.loadPage('refill.html');
//                 }
//             },
//             {
//                 text: "<span style='color:#cd1e21'>Vi</span><span style='color:#000'>sa</span>",
//                 onClick: function () {
//                     // mainView.router.loadPage('visa.html');
//                     myApp.addNotification({
//                         title: 'Limited Support Region',
//                         message: "This service is currently unavailable in your region."
//                     });
//                 }
//             }
//         ];
//         myApp.actions(buttons);
//     }
// }

// function WalletClick() {
//     var buttons = [
//         {
//             text: "<span style='color:#cd1e21'>Refill</span> <span style='color:#000'>Wallet</span>",
//             onClick: function () {
//                 ShowRefillMenu()
//             }
//         },
//         {
//             text: "<span style='color:#cd1e21'>State</span><span style='color:#000'>ments</span>",
//             onClick: function () {
//                 mainView.router.loadPage('statements.html');
//             }
//         },
//         {
//             text: "<span style='color:#cd1e21'>Commis</span><span style='color:#000'>sions</span>",
//             onClick: function () {
//                 mainView.router.loadPage('commissions.html');
//             }
//         }

//     ];
//     myApp.actions(buttons);
// }

function openPanelLeft() {
    $$('#mbody').attr('style', "background:radial-gradient(ellipse at right center, #090909 20%,#9e040a 57%,#e23333 100%);");
}

function openPanelRight() {
    $$('#mbody').attr('style', "background:radial-gradient(ellipse at left center, #090909 20%,#9e040a 57%,#e23333 100%);");
}

// function LoadBillsSection() {
//     var uobj = getuobj();
//     $('.rpages').hide();
//     $('.bl').show();
//     myApp.openPanel('right');
//     openPanelRight();
// }

// function onNotificationAPN(event) {
//     if (event.alert) {
//         navigator.notification.alert(event.alert);
//     }
//     if (event.sound) {
//         var snd = new Media(event.sound);
//         snd.play();
//     }
//     if (event.badge) {
//         pushNotification.setApplicationIconBadgeNumber(function () { }, function () { }, event.badge);
//     }
// }

// function tokenHandler(result) {
//     var uobj = getuobj();
//     var request = {
//         'controller': 'user',
//         'action': 'updateiosdevice',
//         'token': result,
//         'userid': uobj.id
//     };
//     window.MalipoMoneyAPI.queryApi(request, function (d) {
//         if (d.success == 1)
//         { }
//     }, function (e) { });
// }

// function onNotification(e) {
//     switch (e.event) {
//         case 'registered':
//             if (e.regid.length > 0) {
//                 var uobj = getuobj();
//                 var request = {
//                     'controller': 'user',
//                     'action': 'updateandroiddevice',
//                     'token': e.regid,
//                     'userid': uobj.id
//                 };
//                 window.MalipoMoneyAPI.queryApi(request, function (d) {
//                     if (d.success == 1)
//                     { }
//                 }, function (e) { });
//             }
//             break;
//         case 'message':
//             myApp.alert(e.payload.message, 'Notification');
//             break;
//         case 'error':
//             myApp.alert(e.msg, 'Notification Error');
//             break;
//         default:
//             myApp.alert("EVENT -> Unknown, an event was received and we do not know what it is", 'Notification Error');
//             break;
//     }
// }

/*$$(window).load(function () {
    $('#mbody').show();
    setTimeout(function () {

        $("<style type='text/css'> .list-block ul {background: transparent;} .toolbar a.link {color:white}</style>").appendTo("head");
        navigator.splashscreen.hide();
        //
        var AndroidSuccessHandler = function (result) { }
        var AndroidFailHandler = function (error) { }
        //push msgs
        //
        var pushNotification;
        if (window.plugins) {
            pushNotification = window.plugins.pushNotification;
            if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
                pushNotification.register(AndroidSuccessHandler, AndroidFailHandler,
                    {
                        "senderID": "469637007090",
                        "ecb": "onNotification"
                    });
            }
            else {
                pushNotification.register(tokenHandler, function () { },
                    {
                        "badge": "true",
                        "sound": "true",
                        "alert": "true",
                        "ecb": "onNotificationAPN"
                    });
            }
        }

    }, 1000)
});*/

// $(document).ready(function () {
//     window.MalipoMoneyAPI.init('r58rxq6nrFUc6Xt45r58rxq66nrFViFucV4Z52I8',
//         function () {
//             if (isLoggedIn()) {
//                 LoadUser();
//             }
//         }, function (e) {
//             alert(e);
//         })

//     //check if isloggedin
//     if (isLoggedIn()) {
//         if (isAndroid) {
//             $('#login_in').css('margin-top', '56px');
//         } else {
//             $('#login_in').css('margin-top', '20px');
//         }
//         $('#topname').html('Dashboard');
//         $('#login_top').css('margin-top', '40px');
//         $('#login_logo').hide();
//         $('#login_out').hide();
//         $('#login_in').show();
//         $('#panelloginout').hide();
//         $('#panelloginin').show();
//         if (myApp) {
//             myApp.closePanel();
//             mainView.hideToolbar();
//         }

//     } else {
//         $('#panelloginout').show();
//         $('#panelloginin').hide();
//         $('#login_top').css('margin-top', '15%');
//         $('#topname').html('Sign In');
//         $('#login_logo').show();
//         $('#login_out').show();
//         $('#login_in').hide();
//     }
// });
