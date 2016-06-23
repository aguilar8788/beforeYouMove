//Loads map when page loads
var map;
var initMap = function() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.0902, lng: -95.7129},
    zoom: 4
  });
}

$(document).ready(function(){

    getStates();

    $('.states').change(stateSelection);

    $('#search').submit(submitInfo);

    $('.back').on('click', submitInfo);

})
