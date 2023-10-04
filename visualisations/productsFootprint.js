import { height, margin } from "./constants.js"
import { neutralColour } from "./constants.js"

const prepareData = data => data
    .filter(d => d['Release Year'] >= 2018)
    .sort((a, b) => a['Release Year'] - b['Release Year'])

const getProductImg = product => `img/${product.replace(/\s/g, "")}.webp`

export const productsFootprint = (svg, data) => {
    const width = 500
    const dataPrepared = prepareData(data)

    svg
        .style('background-color', '#F2EAD3')

    const x = d3
        .scaleBand()
        .domain(d3.map(dataPrepared, d => d.Product))
        .range([margin.left, width - margin.right])
        .padding([0.2])
    svg
        .append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(
            d3
                .axisBottom(x)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(d => d.replace('iPhone ', ''))
        )
        .select('.domain').remove()

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(dataPrepared, d => d['Carbon Footprint']) * 1.2])
        .range([height - margin.bottom, 0])

    svg
        .selectAll('.phone')
        .data(dataPrepared)
        .join('image')
        .attr('x', d => x(d.Product))
        .attr('y', d => y(d['Carbon Footprint']))
        .attr('width', x.bandwidth())
        .attr('height', d => height - margin.bottom - y(d['Carbon Footprint']))
        .attr('preserveAspectRatio', 'none')
        .style('opacity', 0.75)
        .attr('xlink:href', d => getProductImg(d.Product))

    svg
        .selectAll('.label')
        .data(dataPrepared)
        .join('text')
        .attr('x', d => x(d.Product) + x.bandwidth() / 2)
        .attr('y', d => y(d['Carbon Footprint']) - 5)
        .attr('font-size', 18)
        .attr('text-anchor', 'middle')
        .attr('fill', neutralColour)
        .text(d => d['Carbon Footprint'])
}