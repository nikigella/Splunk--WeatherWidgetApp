import React, { Component } from 'react'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {convertKelvinToFahrenheit} from '../../src/util'

class HourlyForecastWeatherComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            list: [],           // To hold the response from api call
            hourTempData: []    // Holds the three hour interval temperature data
        };
        this.prepareThreeHourIntervalData = this.prepareThreeHourIntervalData.bind(this)
        this.convertFullTime = this.convertFullTime.bind(this)
    }

    componentDidMount() {
        fetch("http://api.openweathermap.org/data/2.5/forecast?q=Atlanta,USA&appid=335cba2fa3d40cfb07c1dbe4eb82883d")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        list: result.list
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
        This function populates the three hour interval weather 
        data array using the response from the api call
    */
    prepareThreeHourIntervalData() {
        let hourTemp = {}
        // Time from the api response
        var fullTime;
        var tempInKelvin;
        var tempInFahrenheit;
        // Formatted time to show hour and am/pm
        var strTime;
        for (let i = 0; i <= 7; i++) {
            fullTime = this.state.list[i].dt_txt.substring(11)
            strTime = this.convertFullTime(fullTime)
            tempInKelvin = this.state.list[i].main.temp
            tempInFahrenheit = convertKelvinToFahrenheit(tempInKelvin)

            // Populate three hour weather data
            hourTemp.time = strTime
            hourTemp.temp = tempInFahrenheit
            this.state.hourTempData.push(hourTemp)
            hourTemp = {}
        }
    }

    /*
        This function extracts hour and am/pm
        from the time value from api response
    */
    convertFullTime = (fullTime) => {
        let hours = fullTime.substring(0, 2)
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return hours + ' ' + ampm;
    }

    render() {
        const { error, isLoaded, hourTempData} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        }
        return (
            <div>
                {/* Populate three hour interval data */}
                {this.prepareThreeHourIntervalData()}
                {/* Use react rechart library to display
                    three hour weather data in the form
                    of a SimpleAreaChart    
                */}
                <div style={{
                    paddingBottom: '10%',
                    paddingTop: '15%',
                    position: 'relative',
                    height: 0
                    }} > 
                    <span style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%'
                    }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                width={500}
                                height={100}
                                data={hourTempData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 30,
                                    bottom: 0,
                                }}
                            >
                                <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="temp" stroke="#8884d8" fill="#8884d8" label={{ fill: 'blue', fontSize: 15, position: 'top' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </span>
                </div>
               
            </div>
        )
    }

}

export default HourlyForecastWeatherComponent
