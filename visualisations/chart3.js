import { width, height, margin, negativeColour } from "./constants.js"
import { emissionsFormat, expandAxis } from "./aux.js"
import { positiveColour } from "./constants.js"

const prepareData = data => {
    let dataPrepared = data.filter(d => d.Category === 'Corporate emissions')

    dataPrepared = d3
        .nest()
        .key(d => d.Type)
        .key(d => d['Fiscal Year'])
        .rollup(d => d3.sum(d, v => v.Emissions))
        .entries(dataPrepared)
        .map(d => {
            return {
                type: d.key,
                values: d.values.map(v => {
                    return {
                        year: new Date(v.key, 0, 1),
                        emissions: Math.abs(v.value)
                    }
                })
            }
        })

    return dataPrepared
}

export const chart3 = (svg, data) => {
    const dataPrepared = prepareData(data)
    const values = dataPrepared.map(d => d.values.map(v => v.emissions))
    const maxValue = d3.max([...values[0], ...values[1]])

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
        .call(d3.axisLeft(y).ticks(6).tickFormat(emissionsFormat))

    svg.append('text')
        .attr('class', 'axis-label')
        .attr('text-anchor', 'middle')
        .attr('y', 0)
        .attr('x', -height/2)
        .attr('dy', '.75em')
        .attr('transform', 'rotate(-90)')
        .text('CO2e emissions (metric tons)');

    const colours = d3
        .scaleOrdinal()
        .domain(d3.map(dataPrepared, d => d.type))
        .range([negativeColour, positiveColour])

    const lineGenerator = d3
        .line()
        .x(d => x(d.year))
        .y(d => y(d.emissions))

    svg
        .selectAll('.line')
        .data(dataPrepared)
        .join('path')
        .attr('d', d => lineGenerator(d.values))
        .attr('stroke', d => colours(d.type))
        .style('fill', 'none')
        .attr('stroke-width', 5)
}