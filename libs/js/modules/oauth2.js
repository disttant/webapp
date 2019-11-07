/* *
 *
 *
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 *  
 * */



export class oauthClient {



    /* *
    *
    * This function must check the input data field
    * existance and patterns
    * 
    * */
    constructor(data) {

        this.auth_uri = data.auth_uri;
        this.client_id = data.client_id;
        this.redirect_uri = data.redirect_uri;
        this.scope = data.scope;

    }



    /* *
    *
    * This function opens a window asking the Accounts Service
    * to give an access token
    * 
    * */
    getAuthorization = function (){

        // Removal of everything: we need new data
        localStorage.clear();

        // Construction of the entire request uri
        let url;
        let state;

        // Generation of new state
        state = this.genState(32);

        // Generation of the request uri
        url      = this.auth_uri;
        url      = url + "?redirect_uri=" + this.redirect_uri;
        url      = url + "&client_id=" + this.client_id;
        url      = url + "&scope=" + this.scope;
        url      = url + "&response_type=token";
        url      = url + "&state=" + state;

        // Storing the state
        localStorage.setItem('current_state', state);

        // Creation of request into a new window   
        window.authWindow = window.open(url, "_blank", "location=no,menubar=no,scrollbars=no,resizable=no,status=no,titlebar=no,toolbar=no");

    }



    /* *
    *
    * This function is 
    * 
    * returns string
    * 
    * */
    checkCallback = function () {

        // Comprobar los campos requeridos en el fragment
        let uriParams = this.getImplicitUrlParams( window.location.href );
        let sentState = localStorage.current_state;

        // PREG MATCHES

        // Comprobar que el state que llega es el enviado
        if ( uriParams.state !== sentState ){
            localStorage.clear();
            //window.close();
        }

        // Guardar el access token y el refresh token en sessionStorage
        localStorage.removeItem('current_state');
        localStorage.setItem('access_token', uriParams.access_token);
        localStorage.setItem('expires_in', uriParams.expires_in);

        // Exit the flow
        window.close();

    }



    /* *
    *
    * This function is just a generator of random strings
    * used to generate a state
    * 
    * returns string
    * 
    * */
    genState = function (length) {

        var result           = '';
        var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;

    }


    static parseJWT = function (token) {

        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);

    }


    getImplicitUrlParams = function (url) {

        // get query string from url (optional) or window
        var queryString = url ? url.split('#')[1] : window.location.search.slice(1);
        
        // we'll store the parameters here
        var obj = {};
        
        // if query string exists
        if (queryString) {
        
            // split our query string into its component parts
            var arr = queryString.split('&');
        
            for (var i = 0; i < arr.length; i++) {
                // separate the keys and the values
                var a = arr[i].split('=');
            
                // set parameter name and value (use 'true' if empty)
                var paramName = a[0];
                var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
            
                // (optional) keep case consistent
                paramName = paramName.toLowerCase();
                if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
            
                // if the paramName ends with square brackets, e.g. colors[] or colors[2]
                if (paramName.match(/\[(\d+)?\]$/)) {
            
                    // create key if it doesn't exist
                    var key = paramName.replace(/\[(\d+)?\]/, '');
                    if (!obj[key]) obj[key] = [];
            
                    // if it's an indexed array e.g. colors[2]
                    if (paramName.match(/\[\d+\]$/)) {
                        // get the index value and add the entry at the appropriate position
                        var index = /\[(\d+)\]/.exec(paramName)[1];
                        obj[key][index] = paramValue;
                    } else {
                        // otherwise add the value to the end of the array
                        obj[key].push(paramValue);
                    }
                } else {
                    // we're dealing with a string
                    if (!obj[paramName]) {
                        // if it doesn't exist, create property
                        obj[paramName] = paramValue;
                    } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                        // if property does exist and it's a string, convert it to an array
                        obj[paramName] = [obj[paramName]];
                        obj[paramName].push(paramValue);
                    } else {
                        // otherwise add the property
                        obj[paramName].push(paramValue);
                    }
                }
            }
        }
        
        return obj;
    }

    


}






 







//console.log(makeid(5));
// window.openPopup = function (form){

//     var popup = window.open("", "Login", "height=500,width=500");
//     var doc = popup.document;
//     doc.open("text/html", "replace");
//     doc.write(form);
//     doc.close();

// }

