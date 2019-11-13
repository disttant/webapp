/* *
 *
 * App Actions
 * Call the sub-module with its actions
 * 
 * */



setInterval(function(){

    letMeIn = login.checkSession();

    if( letMeIn === false ){

        sessionStorage.clear();
        window.open('./?g=login' , '_self');
        
    }

}, 1000);





$(function () {

    // Detecting network status
    window.addEventListener('online', function(e) {
        
        $('#infobar-conn-error').addClass('d-none');
    });

    window.addEventListener('offline', function(e) {

        $('#infobar-conn-error').removeClass('d-none');
    });



    // Show the sync icon when AJAX is calling
    $( document ).ajaxStart(function() {

        $('#infobar-sync').removeClass('d-none');
    });

    $( document ).ajaxStop(function() {

        $('#infobar-sync').addClass('d-none');
    });



    // Detecting AJAX errors
    $( document ).ajaxError(function() {

        $('#infobar-sync-error').removeClass('d-none');
    });

    $( document ).ajaxSuccess(function() {

        $('#infobar-sync-error').addClass('d-none');
    });



    // Hide the spinner
    setTimeout(() => {
        app
            .spinner('hide')
            .moduleLoad('home');

    }, 2000);



    // Close session button
    $('a[id="logout"]').on('click', function(){

        login.removeSession();
    });



    // Open the menu
    $('button[id="sidebarOpener"]').on('click', function(){

        $('#sidebar-wrapper').toggleClass('d-none');

        $('#sidebar-bg').hide().fadeIn( "slow", function() {});

        let width = $('#sidebar-menu').css('width');

        $('#sidebar-menu').hide().css('right', '-' + width).animate({
            position: [ "toggle", "swing" ],
            right: "+=" + width
        });

    });



    // Close the menu (cases)
    $('div[id="sidebar-bg"], div[id="sidebar-menu"] > a ').on('click', function(){

        $('#sidebar-bg').show().fadeOut( "slow", function() {});

        let width = $('#sidebar-menu').css('width');

        $('#sidebar-menu').show().animate({
            position: [ "toggle", "swing" ],
            right: "-=" + width
        }, 400, function(){

            $('#sidebar-wrapper').toggleClass('d-none');

        });

    });



    // Highlighting selected menu icon
    $('button[name="botMenu"]').on('click', function(){

        // Shadow every icon
        $('button[name="botMenu"] > i').attr('style', 'opacity: 0.1;');

        // Highlight selected one
        $(this).find('i').attr('style', 'opacity: 1;');

        // Load the asked global module
        app.moduleLoad( $(this).attr('id') );

    });
    
});



