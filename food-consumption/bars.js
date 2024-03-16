import { height } from "./constants.js"
import { x, y, getRank, getValue } from "./aux.js"

export const bars = (svg, prev) => {
    let bar = svg
        .append('g')
        .selectAll('rect')

    return ([, data], transition) => bar = bar
        .data(data, d => d.name)
        .join(
            enter => enter
                .append('rect')
                .attr('fill', '#FDD835')
                .attr('x', d => x(getRank(prev, d)))
                .attr('y', d => y(getValue(prev, d)))
                .attr('height', d => height - y(getValue(prev, d)))
                .attr('width', x.bandwidth()),
            update => update
        )
        .call(
            bar => bar
                .transition(transition)
                .attr('y', d => y(d.value))
                .attr('height', d => height - y(d.value))
        )
}