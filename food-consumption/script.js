import { svgWidth, svgHeight, margin, height, duration } from "./constants.js"
import { prepareData } from "./data.js"
import { x, y } from "./aux.js"
import { createBarChart, updateBarChart } from "./chart.js"

const getData = async () =>
    d3.json('./data.json')

const svg = d3
    .select('#chart')
    .attr('width', svgWidth)
    .attr('height', svgHeight)

const chart = svg
    .append('g')
    .attr('transform', `translate(${[margin.left, margin.top]})`)

chart
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(
        d3
            .axisBottom(x)
            .tickSizeOuter(0)
    )

chart
    .append('g')
    .call(
        d3
            .axisLeft(y)
            .tickSizeOuter(0)
            .ticks(5)
    )

getData().then(data => {
    const { keyframes, prev, next } = prepareData(data)

    const barChartFuncs = createBarChart(chart, prev, next)

    const animate = async () => {
        for (const keyframe of keyframes) {
            const transition = chart
                .transition()
                .duration(duration)
                .ease(d3.easeLinear)

            updateBarChart(barChartFuncs, keyframe, transition)

            await transition.end()
        }
    }

    animate()
})