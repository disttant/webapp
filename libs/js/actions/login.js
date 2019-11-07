$(function(){

    $("#login").on( 'click', function(){
        oauth.getAuthorization();
    });

    $("#register").on( 'click', function(){
        window.open("http://accounts.dalher.net/register", "_blank", "location=no,menubar=no,scrollbars=no,resizable=no,status=no,titlebar=no,toolbar=no");
    });

});