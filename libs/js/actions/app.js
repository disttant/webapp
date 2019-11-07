/* *
 *
 * App Actions
 * Call the sub-module with its actions
 * 
 * */
/*$(function () {	

    // Define the default module in case of error
    let defModule     = 'puta';

    // Define wich modules are not callable
    let excludedFiles = [
        'pene'
    ];

    //let uriParams     = index_md.index.getAllUrlParams(window.location.href);
    let currModule    = null;



    $.get(uriParams.m + '.m')
    .done(function() {

        currModule = uriParams.m;

        if( $.inArray(currModule, excludedFiles) !== -1 ){
            currModule = defModule;
        }
        
    })
    .fail(function() { 
        currModule = defModule;
    })
    .always(function(){
        
        $('#spinner').hide();
        $("#content").load(currModule + '.m', function(){

            $.getScript('libs/js/actions/' + currModule + '.js')
            .done(function() {
            })
            .fail(function(){
                console.warn('LOG: No actions needed');
            });

        });

    });

});*/