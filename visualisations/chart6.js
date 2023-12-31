import { height, margin, width } from "./constants.js"
import { emissionsFormat, expandAxis } from "./aux.js"
import { negativeColour, negativeColourLightend } from "./constants.js"

const prepareData = data => {
    let dataPrepared = data.filter(d =>
        d.Category === 'Product life cycle emissions'
        && d.Description !== 'Product carbon offsets')

    const groups = [... new Set(d3.map(dataPrepared, d => d.Description))]
    const stackedData = d3
        .stack()
        .keys(groups)
        .value(([, group], key) => group.get(key).Emissions)
        .order(d3.stackOrderAscending)
        (d3.index(dataPrepared, d => new Date(d['Fiscal Year'], 0, 1), d => d['Description']))

    return { dataPrepared: stackedData, groups: groups }
}

export const chart6 = (svg, data) => {
    const { dataPrepared, groups } = prepareData(data)
    const maxValue = d3.max(d3.union(...dataPrepared.map(d => d.map(v => v[1]))))

    const x = d3
        .scaleTime()
        .domain(d3.extent(data, d => new Date(d['Fiscal Year'], 0, 1)))
        .range([margin.left, width - margin.right])
    svg
        .append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(4))

    const y = d3
        .scaleLinear()
        .domain(expandAxis([0, maxValue]))
        .range([height - margin.bottom, margin.top])
    svg
        .append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks(4).tickFormat(emissionsFormat))

    svg.append('text')
        .attr('class', 'axis-label')
        .attr('text-anchor', 'middle')
        .attr('y', 0)
        .attr('x', -height / 2)
        .attr('dy', '.75em')
        .attr('transform', 'rotate(-90)')
        .text('CO2e emissions (metric tons)')

    const colours = d3
        .scaleOrdinal()
        .domain(groups)
        .range([negativeColour, negativeColourLightend, negativeColourLightend, negativeColourLightend])

    const areaGenerator = d3
        .area()
        .x(d => x(d.data[0]))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))

    svg
        .selectAll('.mylayers')
        .data(dataPrepared)
        .join('path')
        .style('fill', d => colours(d.key))
        .attr('d', areaGenerator)

    svg.append('text')
        .attr('fill', 'white')
        .attr('font-size', 20)
        .attr('text-anchor', 'middle')
        .attr('y', (height / 2) * 1.1)
        .attr('x', (width + margin.left) / 2)
        .attr('dy', '.75em')
        .text('Manufacturing')
}