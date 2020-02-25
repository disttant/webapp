$(function(){

    let letMeIn;

    $("#login").on( 'click', function(){
        oauth.getAuthorization();
    });

    setInterval(function(){

        login.setSession();

        letMeIn = login.checkSession();

        if( letMeIn === false ){

            sessionStorage.clear();
            
        } else {
            window.open('./?g=app' , '_self');
        }

    }, 1000);

    

});