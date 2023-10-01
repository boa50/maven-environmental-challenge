import { width, height, margin } from "./constants.js"

const percToDeg = perc => perc * 360
const degToRad = deg => deg * Math.PI / 180
const percToRad = perc => degToRad(percToDeg(perc))

export const chart7 = (svg, data) => {
    const outerRadius = height - margin.top - margin.bottom
    const innerRadius = outerRadius * 0.75
    const needleRadius = outerRadius * 0.035
    const needleCircleRadius = needleRadius + (needleRadius / 2)
    const needleHeight = outerRadius - needleCircleRadius
    const needleColour = '#777777'

    const chart = svg
        .append('g')
        .attr('transform', `translate(${[margin.left + outerRadius, margin.top + outerRadius]})`)

    const arc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(Math.PI / 2)
        .endAngle(-Math.PI / 2)

    chart
        .append('path')
        .attr('d', arc)
        .attr('fill', 'steelblue')
        .attr('stroke-width', 1)
        .attr('stroke', '#FF0000')

    const needle = chart
        .append('g')
        .attr('transform', `translate(0, ${-needleCircleRadius})`)

    const thetaRad = percToRad(0.73) / 2
    const centerX = 0
    const centerY = 0
    const topX = centerX - needleHeight * Math.cos(thetaRad)
    const topY = centerY - needleHeight * Math.sin(thetaRad)
    const leftX = centerX - needleRadius * Math.cos(thetaRad - Math.PI / 2)
    const leftY = centerY - needleRadius * Math.sin(thetaRad - Math.PI / 2)
    const rightX = centerX - needleRadius * Math.cos(thetaRad + Math.PI / 2)
    const rightY = centerY - needleRadius * Math.sin(thetaRad + Math.PI / 2)

    needle
        .append('path')
        .attr('d', `M ${leftX} ${leftY} L ${topX} ${topY} L ${rightX} ${rightY}`)
        .attr('fill', needleColour)
    needle
        .append('circle')
        .attr('r', needleCircleRadius)
        .attr('fill', needleColour)
}