/**
 * Created by owner-pc on 9/2/15.
 */
$(function(){
    $.get("/fragment/simulation/typical/", {}, function(ph){
       $("#typical_div").html(ph);
    });
});