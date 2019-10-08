loadGrid(){

    for(i = 1 ; i <= 21 ; i++){

        var row = document.createElement("div");
        row.className = "";
        row.style = "";
        row.setAttribute('id', '');

        for(j = 1 ; j <= 21 ; j++){

            var col = document.createElement("div");
            col.className = "";
            col.style = "";
            col.setAttribute('id', '');

        }
    }

}

$(function () {

    loadGrid();

});