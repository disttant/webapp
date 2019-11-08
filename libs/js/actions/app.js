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
        $('#spinner-wrapper').toggleClass('d-none');
        $('#module-wrapper').toggleClass('d-none');
    }, 2000);
    
});



