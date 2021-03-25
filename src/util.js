/*
    This function returns temperature in fahrenheit
    from given kelvin temperature
*/
export const convertKelvinToFahrenheit = (tempInKelvin) => {
    var tempInFahrenheit = Math.floor(( (9/5) * (tempInKelvin- 273)) + 32)
    return tempInFahrenheit
}