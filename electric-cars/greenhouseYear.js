// Based on: https://d3-graph-gallery.com/graph/barplot_grouped_basicWide.html
import { svgWidth, svgHeight, colours } from './constants.js'

const margin = {
    left: 32,
    right: 8,
    top: 8,
    bottom: 32
}
const width = svgWidth - margin.left - margin.right
const height = (svgHeight / 2) - margin.top - margin.bottom

const getData = async () =>
    d3.json('./data/greenhouse-year.json')

const getChart = id =>
    d3.select(`#${id}`)
        .attr('width', svgWidth)
        .attr('height', svgHeight / 2)
        .append('g')
        .attr('transform', `translate(${[margin.left, margin.top]})`)

const transformData = (data, annualKm) => {
    const electric = data[0]
    const combustion = data[1]
    const kmToMiles = annualKm / 1.6
    const returnData = []

    for (let i = 0; i <= electric.lifetime; i++) {
        returnData.push(
            {
                year: i,
                electric: {
                    model: electric.model,
                    emission: (electric.vehicleProduction * electric.lifetime * electric.annualMiles) +
                        (electric.batteryProduction * electric.lifetime * electric.annualMiles) +
                        (electric.fuel * i * kmToMiles)
                },
                combustion: {
                    model: combustion.model,
                    emission: (combustion.vehicleProduction * combustion.lifetime * combustion.annualMiles) +
                        (combustion.batteryProduction * combustion.lifetime * combustion.annualMiles) +
                        (combustion.fuel * i * kmToMiles) +
                        (combustion.fuelCombustion * i * kmToMiles)
                }
            }
        )
    }

    return returnData
}

const plotChart = (data, chart, x, xSubgroup, types, colour) => {
    chart
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(
            d3
                .axisBottom(x)
                .tickFormat(d3.format('d'))
                .tickSize(0)
        )

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.combustion.emission) * 1.25])
        .range([height, 0])
    chart
        .append('g')
        .call(
            d3
                .axisLeft(y)
                .tickFormat(d3.format('.2s'))
                .tickSizeOuter(0)
        )


    chart
        .append('g')
        .selectAll('g')
        .data(data)
        .join('g')
        .attr('transform', d => `translate(${x(d.year)}, 0)`)
        .selectAll('rect')
        .data(d => types.map(key => { return { key: key, emission: d[key].emission } }))
        .join('rect')
        .attr('x', d => xSubgroup(d.key))
        .attr('y', d => y(d.emission))
        .attr('width', xSubgroup.bandwidth())
        .attr('height', d => height - y(d.emission))
        .attr('fill', d => colour(d.key))
}

const chartHigh = getChart('greenhouse-year-high')
const chartLow = getChart('greenhouse-year-low')

getData().then(data => {
    const types = ['electric', 'combustion']
    const greenhouseYearDataHigh = transformData(data, 7000)
    const greenhouseYearDataLow = transformData(data, 16000)


    // Default atributtes
    const x = d3
        .scaleBand()
        .domain(Array.from({ length: d3.max(greenhouseYearDataHigh, d => d.year) + 1 }, (_, index) => index))
        .range([0, width])
        .padding(0.2)

    const xSubgroup = d3
        .scaleBand()
        .domain(types)
        .range([0, x.bandwidth()])
        .padding(0.05)

    const colour = d3
        .scaleOrdinal()
        .domain(types)
        .range([colours.carsSold, colours.combustion])

    plotChart(greenhouseYearDataHigh, chartHigh, x, xSubgroup, types, colour)
    plotChart(greenhouseYearDataLow, chartLow, x, xSubgroup, types, colour)
})