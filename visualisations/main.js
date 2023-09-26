import { width, height, chart2Height } from "./constants.js"
import { chart1 } from "./chart1.js"
import { chart2 } from "./chart2.js"
import { chart3 } from "./chart3.js"
import { chart4 } from "./chart4.js"
import { chart5 } from "./chart5.js"

const getData = async () =>
    Promise.all([
        d3.csv('../dataset/apple_emissions/greenhouse_gas_emissions.csv'),
        d3.csv('../dataset/apple_emissions/normalizing_factors.csv')
    ])

const getSvg = (position, customHeight) =>
    d3
        .select(`#chart${position}`)
        .attr('width', width)
        .attr('height', customHeight ? customHeight : height)

getData().then(datasets => {
    const greenhouseData = datasets[0]
    const normalizingData = datasets[1]

    chart1(getSvg(1), greenhouseData)
    chart2(getSvg(2, chart2Height), greenhouseData)
    chart3(getSvg(3), greenhouseData)
    chart4(getSvg(4), greenhouseData)
    chart5(getSvg(5), greenhouseData, normalizingData)
})