// Based on: https://www.geeksforgeeks.org/calculate-the-width-of-the-text-in-javascript/
const getTextWidth = txt => {

    const text = document.createElement("span");
    document.body.appendChild(text);

    text.style.font = "times new roman";
    text.style.fontSize = 16 + "px";
    text.style.height = 'auto';
    text.style.width = 'auto';
    text.style.position = 'absolute';
    text.style.whiteSpace = 'no-wrap';
    text.innerHTML = txt;

    const width = Math.ceil(text.clientWidth);
    document.body.removeChild(text);

    return width
}

export const addLegend = (id, legends, colours, xPadding = 0) => {
    const legend = d3
        .select(`#${id}`)
        .attr('height', 20)
        .append('g')
        .attr('transform', `translate(1, 15)`)

    let xSpace = 0
    legends.forEach((legendText, idx) => {
        if (idx > 0) {
            legend
                .append('text')
                .attr('x', xSpace + xPadding)
                .attr('y', 0)
                .attr('fill', '#a3a3a3')
                .text('|')

            xSpace += 10 + xPadding
        }

        legend
            .append('text')
            .attr('x', xSpace)
            .attr('y', 0)
            .attr('font-weight', 700)
            .attr('font-size', 14)
            .attr('fill', colours[idx])
            .text(legendText)

        xSpace += getTextWidth(legendText)
    })
}