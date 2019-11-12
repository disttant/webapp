$(function(){

    let letMeIn;

    $("#login").on( 'click', function(){
        oauth.getAuthorization();
    });

    $("#register").on( 'click', function(){
        window.open("http://accounts.dalher.net/register", "_blank", "location=no,menubar=no,scrollbars=no,resizable=no,status=no,titlebar=no,toolbar=no");
    });

    setInterval(function(){

        console.log('LOG: Session starting');
        login.setSession();

        console.warn('LOG: Session checking');
        letMeIn = login.checkSession();

        if( letMeIn === false ){

            console.error('LOG: Session expired');
            sessionStorage.clear();
            
        } else {
            window.open('./?g=app' , '_self');
        }

    }, 1000);

    

});