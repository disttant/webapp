$(function () {

    let oauthConfig = {

        auth_uri: "http://accounts.dalher.net/oauth/authorize",
        client_id: "12",
        redirect_uri: "http://adaptative.dalher.net/gimme.html",
        scope: "broker_r broker_w broker_d"
    
    };

    var oauth = new oauthClient(oauthConfig);

    $("#login").on( 'click', function(){
        oauth.getAuthorization();
    });

    $("#register").on( 'click', function(){
        window.open("http://accounts.dalher.net/register", "_blank", "location=no,menubar=no,scrollbars=no,resizable=no,status=no,titlebar=no,toolbar=no");
    });


});