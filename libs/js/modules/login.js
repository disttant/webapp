export class loginController {

    setSession = function () {

        let atoken;
        let decoded;
        
        // Try to take access_token from storage
        atoken = localStorage.access_token;

        // Check if the process ended fine
        if ( atoken == undefined || atoken == '' || atoken == null ){ return false; }

        // Check if there is a valid access_token (client side)
        try{
            decoded = jwt_decode(atoken); 
        }catch( ex ){ }

        if( typeof decoded !== 'object' ){ return false; }

        // Check if exp is well formatted and token alive
        if( typeof decoded.exp !== 'number' ){ return false; }

        if( decoded.exp < Math.floor(Date.now() / 1000) ){ return false; }

        // Save critical data
        //sessionStorage.setItem('access_token' , atoken );
        //sessionStorage.setItem('expires_in' , localStorage.expires_in );
        localStorage.setItem('exp' , decoded.exp );

        //if ( sessionStorage.access_token !== localStorage.access_token ){ return false; }

        //if ( sessionStorage.expires_in !== localStorage.expires_in ){ return false; }

        //if ( sessionStorage.exp != decoded.exp ){ return false; }

        //localStorage.removeItem('access_token');
        //localStorage.removeItem('expires_in');

        return true;

    }


    checkSession = function () {

        let atoken;
        let decoded;

        // Try to take access_token from storage
        atoken = localStorage.access_token;

        // Check if the process ended fine
        if ( atoken == undefined || atoken == '' || atoken == null ){ 
            return false; 
        }

        // Check if there is a valid access_token (client side)
        try{
            decoded = jwt_decode(atoken); 
        }catch( ex ){ }

        if( typeof decoded !== 'object' ){ return false; }

        // Check if exp is well formatted and token alive
        if( typeof decoded.exp !== 'number' ){ return false; }

        if( decoded.exp < Math.floor(Date.now() / 1000) ){ return false; }

        return true;

    }


    removeSession = function (){

        localStorage.clear();
        
    }


}