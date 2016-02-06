//self-invoking anonymous function
(function() {
  
    // variables
    var cityQuery = 'Indianapolis',
        cityDisplayed = 'Indianapolis',
        apiKey = 'f73550137c3c1623a622a9dcd61ab7bc',
        currentResponded = false,
        forecastResponded = false;   
    
    // init
    
    fetchAll();
    
    var cityInput = document.querySelector('[data-js="cityNameInput"]');

    cityInput.addEventListener('change', function(e)
    {
        cityQuery = this.value;

        fetchAll();
    });
    
    // methods
    function fetchAll()
    {
        fetchCurrent;
        fetchForecast;
    }
    
    function fetchCurrent()
    
    {
        var request = new XMLHttpRequest();
        request.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(cityQuery) + '&APPID=' + apiKey);
        request.onload = handleCurrentResponse;
        request.send();
    }
    
    function fetchForecast()
    
    {
        var request = new XMLHttpRequest();
        request.open('GET', 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + encodeURIComponent(cityQuery) + '&cnt=7&APPID=' + apiKey);
        request.onload = handleForecastResponse;
        request.send();
    }
    
    function handleCurrentResponse(response) {
        var data = JSON.parse(response.target.response)
            city = data.name,
            cityDisplayed = city,
            cityWeatherCurrent = data.weather[0].description,
            cityTempCurrent = kelvinToFahrenheit(data.main.temp);
        
            document.querySelector('[data-js="cityNameInput"]').value = cityDisplayed;
            document.querySelector('[data-js="cityWeatherCurrent"]').innerText = cityWeatherCurrent;
            document.querySelector('[data-js="cityTempCurrent"]').innerText = cityTempCurrent;
        
            currentResponded = true;
            checkAllResponded();
    }
    
    function checkAllResponded() 
    
    {
        
        if (currentResponded && forecastResponded)
            
            {
                document.querySelector('[data-js="main"]').className = 'main';
            }
            
    }function handleForecastResponse(response)
    {
        //console.log(JSON.parse(response.target.response));

        var data = JSON.parse(response.target.response),
            template = '';

        data.list.forEach(function(day)
        {
            //console.log(day);

            var date = new Date(day.dt * 1000),
                weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                weekday = weekdays[date.getDay()],
                high = kelvinToFahrenheit(day.temp.max),
                low = kelvinToFahrenheit(day.temp.min);

            template += '<tr class="day">' +
            '<th class="day__name">' + weekday + '</th>' +
            '<td class="day__weather"><i data-icon="'+ getConditionsIcon(day.weather[0].id) +'"></i></td>' +
            '<td class="day__high">' + high + '</td>' +
            '<td class="day__low">' + low + '</td>';
        });

        document.querySelector('[data-js="daysInner"]').innerHTML = template;

        forecastResponded = true;
        checkAllResponded();
    }

    function kelvinToFahrenheit(kelvin)
    {
        return Math.round(kelvin * (9/5) - 459.67);
    }

    function getConditionsIcon(code)
    {
        //console.log(code);

        var codeStr = code.toString(),
            icon = 'B';

        switch (parseInt(codeStr[0]))
        {
            case 2:
                icon = 'P';
                break;
            case 3:
                icon = 'Q';
                break;
            case 5:
                icon = 'R';
                break;
            case 6:
                icon = 'W';
                break;
            case 7:
                icon = 'E';
                break;
            case 8:
                if (code === 800)
                {
                    icon = 'B';
                }
                else
                {
                    icon = 'Y';
                }
                break;
            default:
                //console.log(code);
        }

        return icon;
    }
})();
