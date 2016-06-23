
var removeMarkers = function(){
    for(i=0; i<gmarkers.length; i++){
    gmarkers[i].setMap(null);
    }
  }

var getStates = function(){

    $.get("app.json", function(data){
      var states = data.states

      for(var key in states){
          $('.states').append('<option value="' + key + '" class="options">' + key + '</option>')

        }
    });
};

//For google maps api
var stateSelection = function() {
    state = $(this).val();

    $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + state + ', US' + "&key=AIzaSyBE2lzib-47xKBY_Qwszr8xKdQdTCd44Rk", function(data){

          var lat = data.results[0].geometry.location.lat;
          var long = data.results[0].geometry.location.lng;

          var myLatlng = new google.maps.LatLng(lat,long);
          var mapOptions = {
          zoom: 6,
          center: myLatlng
          }
          var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    });
};

//For google maps api
var citySelection = function(){
  city = $(this).text();
  input = $("#user");

  $('input').append(city);

  input.val(input.val() + city );

  $('#search').submit();
};
//For google maps api
var removeMarkers = function(){
    for(i=0; i<gmarkers.length; i++){
    gmarkers[i].setMap(null);
  }
};

var neighborhoodsClickFunction = function(){
  $(".content3").on('click', ".results", function(){
      selected = $(this).text();
      urlSelect = selected + ', ' + select;
      noSpace = selected.replace(/\s+/g, "+");

      manipulateDOM();
      getGoogleMaps();
      placesFilter();
  });
};
//Pulls neighborhoods from given city
var zillowInfo = function(){
    $.get("https://galvanize-cors-proxy.herokuapp.com/https://www.zillow.com/webservice/GetRegionChildren.htm?zws-id=X1-ZWz1fa6mlbax3f_4wzn5&state="+ select + "&city=" + userChoice + "&childtype=neighborhood" , function(d){

          $(d).find('region').each(function(){
              var $request = $(this);
              var name = $request.find('name').text();

              $('.content3').append('<p class="results">' + '<a href="#">' + name + '</a>' + '</p>')
          });

          neighborhoodsClickFunction();
    });
};

var getGoogleMaps = function(){
  $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + urlSelect + "&key=AIzaSyBE2lzib-47xKBY_Qwszr8xKdQdTCd44Rk", function(data){

        lat = data.results[0].geometry.location.lat;
        long = data.results[0].geometry.location.lng;

        myLatlng = new google.maps.LatLng(lat,long);
        var mapOptions = {
            zoom: 14,
            center: myLatlng
          }
          var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    });
};

var manipulateDOM = function(){
      emptyDom();
      $('.back').css("display", "flex")
      $('.content').css("display", "none")
      $('.content3').css("display", "none")
      $('.content2').css("display", "flex");
      $('.list').css("display", "flex");
      $('.heading').append('<h1>' + selected + '</h1>');
      $('.content2').append('<p class="place" id="">grocery_or_supermarket</p><p class="holder">|</p>');
      $('.content2').append('<p class="place">restaurant</p><p class="holder">|</p>');
      $('.content2').append('<p class="place">school</p><p class="holder">|</p>');
      $('.content2').append('<p class="place">transit_station</p><p class="holder">|</p>');
      $('.content2').append('<p class="crime" ><a href="http://www.areavibes.com/' + userChoice + '-' + select + '/' + noSpace + '/crime/" target="_blank">crime</a></p>');
};

var manipulateCss = function(){
      emptyDom();
      $('.content3').fadeIn('slow').css('display', 'flex');
      $('.content').css("height", "auto")
      $('.back').css("display", "none");
      $('.content2').css("display", "none");
      $('.list').css("display", "none");
};
//Allows new information to populate
var emptyDom = function(){
      $('.content3').empty()
      $('.content').empty();
      $('.content2').empty();
      $('.heading').empty();
      $('.list').empty();
};

var placesFilter = function(){
      $('.place').on('mouseover', function(){
            $('.list').css("display", "flex");
            var listPlace;
            var place = $(this).not('#crime').text();

            infowindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(map);

            service.nearbySearch({
                location: {lat: lat, lng: long},
                radius: 1000.03,
                type: [place]
            }, callback);

            function callback(results, status) {

                if (status === google.maps.places.PlacesServiceStatus.OK) {
                      $('.list').empty();
                for (var i = 0; i < results.length; i++) {
                      result = results[i]
                      gmarkers.push(marker);
                      createMarker(results[i]);
                  }

                if(place == 'transit_station'){
                      for (var i = 0; i < results.length; i++) {
                          $('.list').append('<p class="name" id="address">' + results[i].name + '</p>')
                      }
                  }else {
                      for (var i = 0; i < results.length; i++) {
                          $('.list').append('<p class="name" id="addresses">' + results[i].name + '</p><p class="address">' + results[i].vicinity + '</p>')
                  }
            }
      }
};


            removeMarkers()

            function createMarker(place) {

                placeLoc = place.geometry.location;
                marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });
                gmarkers.push(marker);

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent(place.name);
                    infowindow.open(map, this);
                });
              }
                marker = new google.maps.Marker({
                    position: myLatlng,
                    title:"Hello World!"
              });

            marker.setMap(map);
            gmarkers.push(marker);

    });
};



var truliaInfo = function(){
      $.get("https://galvanize-cors-proxy.herokuapp.com/http://api.trulia.com/webservices.php?library=LocationInfo&function=getCitiesInState &state=" + select + "&apikey=szjq4tcvujfgprrtpkk57d2m" , function(d){

            $(d).find('city').each(function(){
                  results2 = $(this).find('name').text();
                  return $('.content3').append('<p class="results2">' + '<a href="#">' + results2  + '</a>' + '</p>');
              });
            $('.results2').on('click', citySelection);
    });
}



var submitInfo = function(){
      userChoice = $('#user').val();
      lower = userChoice.toLowerCase();
      select = $('.states option:selected').val();
      urlSelect = userChoice + ', ' + select;

      $('.content3').empty();
      $('#map').css('height', '80%');
      $('#map').css('visibility', 'visible');

      initMap()

      if(userChoice == ''){
          manipulateCss();
          truliaInfo();

      }else {
          manipulateCss();
          zillowInfo();
      }

      $('#user').empty();
      return false;
};
