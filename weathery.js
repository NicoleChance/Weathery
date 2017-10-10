$(document).ready(function() {

  // Initializes variables used throughout the app
  var $app = {
    location: null,
    weather: {
      string: null,
      icon: null,
    },
    temperature: {
      icon: null,
      celsius: null,
      fahrenheit: null,
      display: {
        celsius: true,
        fahrenheit: false
      }
    }
  };

  $app.init = _.throttle(function() {
    $app.setTemperatureIcon();
    navigator.geolocation.getCurrentPosition($app.updateWeather, function(e) { console.log(e); });

    $("#foo").off().on("click", function() {
      $app.init();
    });
  }, 1000);

  $app.updateWeather = function(geolocation) {
    console.log("Geolocation Object:", geolocation);
    var lat = geolocation.coords.latitude;
    var lon = geolocation.coords.longitude;
    console.log("var lat = " + lat + "\nvar lon = " + lon);
    $.get("https://fcc-weather-api.glitch.me/api/current?lat=" + lat + "&lon=" + lon, function(data) {
      console.log(data);
      $app.location = data.name;
      $app.setTemperature(data);
      $app.setWeather(data);
      $app.render();
    });
  }

  $app.setTemperature = function(data) {
    $app.temperature.celsius = _.round(data.main.temp, 2).toFixed(2);
    $app.temperature.fahrenheit = _.round((data.main.temp * 9 / 5 + 32), 2).toFixed(2);
    $app.setTemperatureIcon($app.temperature.celsius);
  }

  $app.setWeather = function(data) {
    $app.setWeatherString(data);
    $app.setWeatherIcon(data);
  }

  $app.setTemperatureIcon = function(celsius) {
    switch (celsius) {
      case (celsius > 30):
        $app.temperature.icon = 'fa fa-thermometer-4';
        break;
      case (celsius > 25):
        $app.temperature.icon = 'fa fa-thermometer-3';
        break;
      case (celsius > 20):
        $app.temperature.icon = 'fa fa-thermometer-2';
        break;
      case (celsius > 15):
        $app.temperature.icon = 'fa fa-thermometer-1';
        break;
      default:
        $app.temperature.icon = 'fa fa-thermometer-0';
        break;
    }
  }

  $app.setWeatherString = function(data) {
    var weatherString = 'Current weather conditions include';
    _.forEach(data.weather,function(weatherItem, key){
        if (key == 0) {
            weatherString = weatherString+" "+weatherItem.description;
        } else if (key < (_.size(data.weather)-1)) {
            weatherString = weatherString+", "+weatherItem.description;
        } else if (key == (_.size(data.weather)-1)) {
            weatherString = weatherString+" and "+weatherItem.description;
        }
    });
    $app.weather.string = weatherString;
  }

  $app.setWeatherIcon = function(data) {
    var weather = _.toLower(data.weather[0].main);
    switch (weather) {
      case 'drizzle':
        $app.weather.icon = 'wi wi-showers';
        break;
      case 'clouds':
        $app.weather.icon = 'wi wi-cloudy';
        break;
      case 'rain':
        $app.weather.icon = 'wi wi-rain';
        break;
      case 'snow':
        $app.weather.icon = 'wi wi-snow';
        break;
      case 'clear':
        $app.weather.icon = 'wi wi-day-sunny';
        break;
      case 'thunderstorm':
        $app.weather.icon = 'wi wi-thunderstorm';
        break;
      case 'mist':
        $app.weather.icon = 'wi wi-fog';
        break;
    }
  }

  $app.render = function() {
    $("#temperature-display").html(
      "<div>" + $app.location + "</div>" +
      "<div id='weather'><i class='weather-icon " + $app.weather.icon + "' aria-hidden='true'></i></div>" +
      "<div><div id='celsius'><i class='" + $app.temperature.icon + "' aria-hidden='true'></i> " + $app.temperature.celsius + " &#8451;</div>" +
      "<div id='fahrenheit'><i class='" + $app.temperature.icon + "' aria-hidden='true'></i> " + $app.temperature.fahrenheit + " &#8457;</div>" +
      "<div id='temperature-switch' class='btn btn-default text-center cursor-hover'><i class='fa fa-exchange'></i></div></div>" +
      "<i>"+$app.weather.string+"</i>"
    );

    if ($app.temperature.display.celsius) {
      $("#celsius").show();
    } else {
      $("#celsius").hide();
    }
    if ($app.temperature.display.fahrenheit) {
      $("#fahrenheit").show();
    } else {
      $("#fahrenheit").hide();
    }

    $("#temperature-switch").off().on("click", function() {
      if ($app.temperature.display.celsius == true) {
        $app.temperature.display.celsius = false;
        $app.temperature.display.fahrenheit = true;
      } else {
        $app.temperature.display.celsius = true;
        $app.temperature.display.fahrenheit = false;
      }
      $app.render();
    });
  }

  // This kicks off the app
  if ($app.init && _.isFunction($app.init)) {
    $app.init();
  }

  // View



});
