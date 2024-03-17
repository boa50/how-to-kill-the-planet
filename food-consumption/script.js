import { svgWidth, svgHeight, margin, duration } from "./constants.js"
import { prepareData } from "./data.js"
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

getData().then(data => {
    const { keyframes, prev, next } = prepareData(data)

    const barChartFuncs = createBarChart(chart, prev)

    const isLast = keyframe => keyframe[1][1].value === 99

    const animate = async () => {
        for (const keyframe of keyframes) {

            const transition = chart
                .transition()
                .duration(duration)
                .ease(d3.easeLinear)

            updateBarChart(barChartFuncs, keyframe, transition, isLast(keyframe))

            await transition.end()
        }
    }

    animate()
})