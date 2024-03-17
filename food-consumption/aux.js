import { width, height, barPadding, n } from "./constants.js"

export const x = d3
    .scaleBand()
    .domain(d3.range(n))
    .range([0, width])
    .padding(barPadding)

export const y = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height, 0])

export const getRank = (mapping, d) => (mapping.get(d) || d).rank
export const getValue = (mapping, d) => (mapping.get(d) || d).value