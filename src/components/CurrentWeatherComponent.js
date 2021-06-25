import React, { Component } from 'react'
import '../../src/assets/css/currentweather.css'
import {convertKelvinToFahrenheit} from '../../src/util'

class CurrentWeatherComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],                  // Stores the response from api call
            currentWeatherData: []      // Holds the current weather data information
        };
        // this.prepareCurrentWeatherData = this.prepareCurrentWeatherData.bind(this)
        // this.convertTimeStamp = this.convertTimeStamp.bind(this)
        // this.convertWeatherDescription = this.convertWeatherDescription.bind(this)
    }

    componentDidMount() {
        fetch("http://api.openweathermap.org/data/2.5/weather?q=Atlanta,USA&appid=335cba2fa3d40cfb07c1dbe4eb82883d")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    })
                },
                (error) => {
                    this.setState({
                        isLoaded: false,
                        error
                    });
                }
            )
    }

    /*
        This function populates the current weather data array 
        using the response from the api call
    */
   
    prepareCurrentWeatherData = () => {
        let data = {}               // Object to hold display data
        let city = this.state.items.name
        // Convert unix timestamp to datetime stamp
        var date = new Date(this.state.items.dt * 1000)
        var day = date.toLocaleString('en-us', {  weekday: 'long' });
        // Time with am/pm
        var strTime = this.convertTimeStamp(date)
        var weatherDescription = this.convertWeatherDescription(this.state.items.weather[0].description)
        var tempInFahrenheit = convertKelvinToFahrenheit(this.state.items.main.temp)
        var formattedTempInFahrenheit = tempInFahrenheit 
        var formattedTempInFahrenheitExtension = '\u00b0' + 'F'

        // Weather Icon
        var weatherIcon = "http://openweathermap.org/img/w/" + this.state.items.weather[0].icon + ".png"

       // Populate display data
        data = {}
        data.city = city
        data.day = day
        data.time = strTime
        data.weatherDescription = weatherDescription
        data.tempFahrenheit = formattedTempInFahrenheit
        data.tempFahrenheitExt = formattedTempInFahrenheitExtension
        data.icon = weatherIcon
        this.state.currentWeatherData.push(data)
    
    }

    /*
        This function extracts display time from date
    */
    convertTimeStamp = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes()
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ":" + minutes + ' ' + ampm;
        return strTime
    }

    /*
        This function converts weather description to camel case
        for display
    */
    convertWeatherDescription = (description) => {
        var splitDescription = description.toLowerCase().split(' ');
        for (let i = 0; i < splitDescription.length; i++) {
            splitDescription[i] = splitDescription[i].charAt(0).toUpperCase() + splitDescription[i].substring(1);
        }

        var weatherDescription = splitDescription.join(' ')
        return weatherDescription

    }

    render() {
        const { error, isLoaded, currentWeatherData } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        }
        return (
            <div>
                {/* Populate current weather data */}
               {this.prepareCurrentWeatherData()}
               {/* Display current weather data */}
                <span className="city">{currentWeatherData[0].city}</span>
                <br />
                <span className="daytime">{currentWeatherData[0].day} {currentWeatherData[0].time}</span>
                <br />
                <span className="daytime">{currentWeatherData[0].weatherDescription}</span>
                <br />
                <span>
                    <img src={currentWeatherData[0].icon} className="weathericon"/> 
                    <span className="temp">{currentWeatherData[0].tempFahrenheit}</span>
                    <span className="tempExt"><sup>{currentWeatherData[0].tempFahrenheitExt}</sup></span>
                </span>
                <br />
            </div>
        )
    }

}

export default CurrentWeatherComponent
