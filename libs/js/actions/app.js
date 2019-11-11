/* *
 *
 * App Actions
 * Call the sub-module with its actions
 * 
 * */

console.log('LOG: Executing actions');



setInterval(function(){

    letMeIn = login.checkSession();

    if( letMeIn === false ){

        sessionStorage.clear();
        window.open('./?g=login' , '_self');
        
    }

}, 1000);



$(function () {

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

        $('#sidebar-bg').hide().fadeIn( "slow", function() {
            console.log('animado');
        });

        let width = $('#sidebar-menu').css('width');

        $('#sidebar-menu').hide().css('right', '-' + width).animate({
            position: [ "toggle", "swing" ],
            right: "+=" + width
        });

    });



    // Close the menu (cases)
    $('div[id="sidebar-bg"], div[id="sidebar-menu"] > a ').on('click', function(){

        $('#sidebar-bg').show().fadeOut( "slow", function() {
            
        });

        let width = $('#sidebar-menu').css('width');

        $('#sidebar-menu').show().animate({
            position: [ "toggle", "swing" ],
            right: "-=" + width
        }, 400, function(){

            $('#sidebar-wrapper').toggleClass('d-none');

        });

    });



    // Highlighting menu icons
    $('button[name="botMenu"]').on('click', function(){

        // Shadow every menu
        $('button[name="botMenu"] > i').attr('style', 'opacity: 0.1;');

        // Highlight this icon
        $(this).find('i').attr('style', 'opacity: 1;');

        app.moduleLoad( $(this).attr('id') );

    });
    
});



