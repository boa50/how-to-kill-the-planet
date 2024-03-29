// Based on: https://d3-graph-gallery.com/graph/barplot_grouped_basicWide.html
import { svgWidth, svgHeight as svgHeightDefault, colours } from './constants.js'
import { addLegend } from './legend.js'

const margin = {
    left: 32,
    right: 8,
    top: 4,
    bottom: 32
}

const svgHeight = svgHeightDefault - 50
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
                    emission: ((electric.vehicleProduction * electric.lifetime * electric.annualMiles) +
                        (electric.batteryProduction * electric.lifetime * electric.annualMiles) +
                        (electric.fuel * i * kmToMiles)) / 1e6
                },
                combustion: {
                    model: combustion.model,
                    emission: ((combustion.vehicleProduction * combustion.lifetime * combustion.annualMiles) +
                        (combustion.batteryProduction * combustion.lifetime * combustion.annualMiles) +
                        (combustion.fuel * i * kmToMiles) +
                        (combustion.fuelCombustion * i * kmToMiles)) / 1e6
                }
            }
        )
    }

    return returnData
}

const plotChart = (data, chart, x, xSubgroup, types, colour) => {
    const xAdded = chart
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(
            d3
                .axisBottom(x)
                .tickFormat(d3.format('d'))
                .tickSize(0)
                .tickPadding(10)
        )

    xAdded
        .select('.domain')
        .remove()
    xAdded
        .append('path')
        .attr('d', 'M -15 0.5 H 660.5')
        .attr('stroke', '#d4d4d4')

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.combustion.emission) * 1.25])
        .range([height, 0])
    const yAdded = chart
        .append('g')
        .call(
            d3
                .axisLeft(y)
                .tickFormat(d3.format('d'))
                .tickSize(0)
                .tickPadding(5)
                .ticks(6)
        )

    yAdded
        .select('.domain')
        .remove()
    yAdded
        .select('.tick:first-child')
        .remove()

    const lastTick = yAdded
        .select('.tick:last-child')

    lastTick
        .append('text')
        .attr('dx', '2em')
        .attr('dy', lastTick.select('text').attr('dy'))
        .attr('fill', 'currentColor')
        .text('tCO₂')


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

const addChartKm = (chart, km) => {
    chart
        .append('text')
        .attr('x', 50)
        .attr('y', 100)
        .attr('fill', colours.lowAttention)
        .attr('font-size', 50)
        .attr('opacity', 0.5)
        .text(`${km.toString().replaceAll('0', '')}k km / month`)
}

const chartHigh = getChart('greenhouse-year-high')
const chartLow = getChart('greenhouse-year-low')
const kmLow = 7000
const kmHigh = 16000

addLegend(
    'greenhouse-year-legend',
    ['Electric', 'Combustion'],
    [colours.carsSold, colours.combustion],
    2
)

addChartKm(chartHigh, kmLow)
addChartKm(chartLow, kmHigh)

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