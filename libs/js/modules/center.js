$(function () {

    // Esconder contenido principal
    $('#main').hide();
    // Mostrar spinner
    $('#spinner').show();

    // Acoplar nombre de usuario
    $('#user').append(sessionStorage.user_id);
    // Obtener lista de grupos
    //getGroupList();

    setTimeout(function(){
        $('#spinner').hide();
        $('#main').show();
    }, 100);

});