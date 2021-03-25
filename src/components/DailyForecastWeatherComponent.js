import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import {convertKelvinToFahrenheit} from '../../src/util'
import '../../src/assets/css/dailyforecastweather.css'

class DailyForecastWeatherComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            daily: [],              // To hold the response from api call
            dailyForecastData: []   // To hold the forecast weather data from api response
        };
        this.prepareDailyForecastData = this.prepareDailyForecastData.bind(this)
    }

    componentDidMount() {
        fetch("https://api.openweathermap.org/data/2.5/onecall?lat=33.749&lon=-84.388&exclude=current,minutely,hourly,alerts&appid=335cba2fa3d40cfb07c1dbe4eb82883d")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        daily: result.daily
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
        This function populates the forecast weather 
        data array using the response from the api call
    */
    prepareDailyForecastData() {
        let data = {}       // Object to hold display data
        var day;
        var date;
        var weatherDescription;
        var minTempInKelvin, maxTempInKelvin, minTempInFahrenheit, maxTempInFahrenheit;
        var weatherIcon;
        for (let i = 0; i < this.state.daily.length; i++) {
            // Get the day from api response
            date = new Date(this.state.daily[i].dt * 1000)
            day = date.toLocaleString('en-us', {  weekday: 'short' });

            // Weather icon from api response
            weatherIcon = "http://openweathermap.org/img/w/" + this.state.daily[i].weather[0].icon + ".png"

            // Weather description from api response
            weatherDescription = this.state.daily[i].weather[0].main

            // Min and max temp from api response
            minTempInKelvin = this.state.daily[i].temp.min
            maxTempInKelvin = this.state.daily[i].temp.max

            // Convert temperature in kelvin to fahrenheit
            minTempInFahrenheit = convertKelvinToFahrenheit(minTempInKelvin)
            maxTempInFahrenheit = convertKelvinToFahrenheit(maxTempInKelvin)

            // Populate forecast weather data
            data.day = day
            data.weatherDescription = weatherDescription
            data.minTemp = minTempInFahrenheit + '\u00b0'
            data.maxTemp = maxTempInFahrenheit + '\u00b0'
            data.icon = weatherIcon

            this.state.dailyForecastData.push(data)
            data = {}
        }
    }

    /*
        This function displays the forecast data in a card
    */
    renderCard = (card, index) => {
        return <Card style={{ width: '5rem', display: 'flex', flexDirection: 'row' }} key={index}>
                <Card.Body>
                    <Card.Title>{card.day}</Card.Title>
                    <Card.Img variant="middle" src={card.icon} />
                    <Card.Text>
                    {card.maxTemp} <span className="mintemp">{card.minTemp}</span>
                    </Card.Text>
                </Card.Body>
            </Card>
    }

    render() {
        const { error, isLoaded, dailyForecastData} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        }
        return (
            <div>
                {/* Populate weather forecast data */}
                {this.prepareDailyForecastData()}
                {/* Display weather forecast data in a deck of cards */}
                <CardDeck>{dailyForecastData.map(this.renderCard)}</CardDeck>
            </div>
        )
    }

}

export default DailyForecastWeatherComponent
