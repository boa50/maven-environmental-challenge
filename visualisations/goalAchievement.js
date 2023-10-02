import { height, margin } from "./constants.js"

const percToDeg = perc => perc * 180
const degToRad = deg => deg * Math.PI / 180
const percToRad = perc => degToRad(percToDeg(perc - 0.5))

const outerRadius = height - margin.top - margin.bottom
const innerRadius = outerRadius * 0.65

const getAchievement = data => {
    const extentYears = d3.extent(data, d => d['Fiscal Year'])

    let dataPrepared = data.filter(d => d.Type !== 'Carbon removals'
        && (d['Fiscal Year'] === extentYears[0] || d['Fiscal Year'] === extentYears[1]))

    dataPrepared = d3
        .nest()
        .key(d => d['Fiscal Year'])
        .rollup(d => d3.sum(d, v => v.Emissions))
        .entries(dataPrepared)

    const getDataValue = year => dataPrepared.filter(d => d.key === year)[0].value

    return 1 - (getDataValue(extentYears[1]) / getDataValue(extentYears[0]))
}

const getArc = (start, end) => {
    return d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(percToRad(start))
        .endAngle(percToRad(end))
}

export const goalAchievement = (svg, data) => {
    const achievement = getAchievement(data)

    console.log(achievement);

    const chart = svg
        .append('g')
        .attr('transform', `translate(${[margin.left + outerRadius, margin.top + outerRadius]})`)

    // ACHEIVED
    chart
        .append('path')
        .attr('d', getArc(0, achievement + 0.01))
        .attr('fill', '#628B2E')

    // REMAINING
    chart
        .append('path')
        .attr('d', getArc(achievement, 1))
        .attr('fill', '#B3D785')

    // GOAL
    chart
        .append('path')
        .attr('d', getArc(0.7475, 0.7525))
        .attr('fill', '#034D4F')

}