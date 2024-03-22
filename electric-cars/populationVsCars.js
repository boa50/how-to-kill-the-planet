import { svgWidth, svgHeight } from "./constants.js"

const margin = {
    left: 64,
    right: 64,
    top: 32,
    bottom: 8
}
const width = svgWidth - margin.left - margin.right
const height = svgHeight - margin.top - margin.bottom


const getData = async () =>
    Promise.all([
        d3.json('./data/population.json'),
        d3.json('./data/cars-sold.json')
    ])

const svg = d3
    .select('#population-vs-cars')
    .attr('width', svgWidth)
    .attr('height', svgHeight)

const chart = svg
    .append('g')
    .attr('transform', `translate(${[margin.left, margin.top]})`)