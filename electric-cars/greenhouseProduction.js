// Based on https://observablehq.com/@d3/sunburst-component
import { svgWidth, svgHeight as svgHeightDefault, colours } from './constants.js'

const margin = {
    left: 8,
    right: 8,
    top: 8,
    bottom: 8
}

const svgHeight = svgHeightDefault - 20
const width = svgWidth - margin.left - margin.right
const height = svgHeight - margin.top - margin.bottom

const startAngle = 0
const endAngle = 2 * Math.PI
const radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2
const padding = 2

// TO GET THE TOTAL VALUE WE MUST USE THE NUMBER OF MILES AND YEARS USED TO EXRTACT THE DATA
const multiplier = 2000 * 5


const getData = async () =>
    d3.json('./data/greenhouse-production.json')

const svg = d3
    .select('#greenhouse-production')
    .attr('width', svgWidth)
    .attr('height', svgHeight)

const chart = svg
    .append('g')
    .attr('transform', `translate(${[(width / 2) + margin.left, (height / 2) + margin.top]})`)

const getColour = obj => {
    const typeColours = {
        'electric': colours.carsSold,
        'combustion': colours.combustion,
        'default': colours.backgroundContrast
    }

    switch (obj.depth) {
        case 2:
            return typeColours[obj.parent.id]
        case 1:
            return typeColours[obj.id]
        default:
            return typeColours['default']
    }
}

getData().then(data => {
    const productionAverage = [
        {
            'type': '',
            'subtype': 'root',
            'production': null
        }
    ]
    const types = [...new Set(data.map(d => d.type))]

    types.forEach(type => {
        const filtered = data.filter(d => d.type === type)
        const vehicle = filtered.reduce((total, current) =>
            total + current['vehicle (per mile)'], 0) / filtered.length
        const battery = filtered.reduce((total, current) =>
            total + current['battery (per mile)'], 0) / filtered.length

        productionAverage.push({
            'type': 'root',
            'subtype': type,
            'prodction': null
        })
        productionAverage.push({
            'type': type,
            'subtype': 'vehicle',
            'prodction': vehicle * multiplier
        })
        productionAverage.push({
            'type': type,
            'subtype': 'battery',
            'prodction': battery * multiplier
        })
    })

    const root = d3
        .stratify()
        .id(d => d.subtype)
        .parentId(d => d.type)
        (productionAverage)

    root.sum(d => d.prodction)
    d3.partition().size([endAngle - startAngle, radius])(root)

    const arc = d3
        .arc()
        .startAngle(d => d.x0 + startAngle)
        .endAngle(d => d.x1 + startAngle)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 2 * padding / radius))
        .padRadius(radius / 2)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1 - padding)

    const cell = chart
        .selectAll('g')
        .data(root.descendants())
        .join('g')

    cell
        .append('path')
        .attr('d', arc)
        .attr('fill', d => getColour(d))
        .attr('fill-opacity', d => (d.height + 2) / 3)

    cell
        .filter(d => d.value > 0 && d.depth > 0)
        .append('text')
        .attr('transform', d => {
            const x = ((d.x0 + d.x1) / 2 + startAngle) * 180 / Math.PI
            const y = (d.y0 + d.y1) / 2
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`
        })
        .attr('dy', '0.25em')
        .attr('dx', d => d.id.length > 8 ? '-2.5em' : '-1.6em')
        .attr('fill', 'white')
        .text(d => d.id)
})