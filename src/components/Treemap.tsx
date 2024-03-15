/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3'
import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TREEMAP_URL, TTreemapData, marketChangeBgStyle, options } from '../shared/treemapConstants'

@customElement('treemap-component')
export class TreemapComponent extends LitElement {
    static styles = css`
        main {
            min-height: 100vh;
            background: #262931;
            display: flex;
            flex-direction: column;
        }
        .treemap{
            height: 95vh;
            margin-bottom: 4px;
        }
        rect {
            stroke: #262931;
        }
        text {
            fill: white;
            text-transform: uppercase;
            text-anchor: middle;
            font-weight: bold;
        }
        .bottom{
            display: flex;
            flex-direction: row-reverse;
            padding-right: 6px;
        }
        .changeStyleTypes{
            display: flex;
            color: white;
            height: 20px;
            column-gap: 4px;
        }
        .categoryChangeBg{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
        }
        .categoryChangeBg:first-child{
            background: #F63538;
        }
        .categoryChangeBg:nth-child(2){
            background: #BF4045;
        }
        .categoryChangeBg:nth-child(3){
            background: #8B444E;
        }
        .categoryChangeBg:nth-child(4){
            background: #414554;
        }
        .categoryChangeBg:nth-child(5){
            background: #35764E;
        }
        .categoryChangeBg:nth-child(6){
            background: #2F9E4F;
        }
        .categoryChangeBg:last-child{
            background: #30D05B;
        }
    `;
    private data: TTreemapData = [{}];

    constructor() {
        super();
    }

    async firstUpdated(): Promise<void> {
        const response = await fetch(TREEMAP_URL, options);
        this.data = await response.json();

        this.createTreemap();
    }

    createTreemap() {
        const dataForTreemap = this.data.map((d: any) => ({
            name: d.name,
            value: d.market_cap,
            change: d.market_cap_change_24h,
            top_3_coins: d.top_3_coins,
        }));

        const root = d3.hierarchy({ children: dataForTreemap } as unknown)
            .sum((d: any) => d.value);

        const svgWidth = this.shadowRoot!.querySelector('.treemap')!.clientWidth;
        const svgHeight = this.shadowRoot!.querySelector('.treemap')!.clientHeight;

        const treemapLayout = d3.treemap().size([svgWidth, svgHeight]);

        treemapLayout(root);

        const svg = d3.select(this.shadowRoot!.querySelector('svg'));

        svg.selectAll('rect')
            .data(root.leaves())
            .enter()
            .append('rect')
            .attr('x', (d: any) => d.x0)
            .attr('y', (d: any) => d.y0)
            .attr('width', (d: any) => d.x1 - d.x0)
            .attr('height', (d: any) => d.y1 - d.y0)
            .style('fill', (d: any) => marketChangeBgStyle(d.data.change))
            .attr('rx', 2)
            .attr('ry', 2)
            .on('mouseover', (event: MouseEvent, d: any) => {
                if (!d.data.top_3_coins) return;
            
                const iconContainer = d3.select(this.shadowRoot!.querySelector('main'))
                    .append('div')
                    .attr('class', 'icon-container');

                //Нужно реализовать очищение иконок
                d3.selectAll('.icon-container').remove();
            
                const iconSize = 20;
                const iconPadding = 5;
            
                d.data.top_3_coins.slice(0, 3).forEach((coin: string, index: number) => {
                    iconContainer.append('img')
                        .attr('src', coin)
                        .attr('width', iconSize)
                        .attr('height', iconSize)
                        .style('position', 'absolute')
                        .style('top', event.clientY + iconPadding + (index * (iconSize + iconPadding)) + 'px')
                        .style('left', event.clientX + iconPadding + 'px')
                });
            })

        const fontSizeScale = d3.scaleLinear()
            .domain([0, d3.max(dataForTreemap, (d: any) => d.value)])
            .range([10, 36]);
        const fontNumSizeScale = d3.scaleLinear()
            .domain([0, d3.max(dataForTreemap, (d: any) => d.value)])
            .range([6, 16]);
        
        svg.selectAll('text')
            .data(root.leaves())
            .enter()
            .append('text')
            .attr('x', (d: any) => (d.x0 + d.x1) / 2)
            .attr('y', (d: any) => (d.y0 + d.y1) / 2)
            .text((d: any) => d.data.name.slice(0, 3))
            .text((d: any) => {
                if (d.data.value > 10000000000) {
                    return d.data.name.slice(0, 3);
                } else {
                    return '';
                }
            })
            .style('font-size', (d: any) => `${fontSizeScale(d.data.value)}px`)

        svg.selectAll('.change-text')
            .data(root.leaves())
            .enter()
            .append('text')
            .attr('class', 'change-text')
            .attr('x', (d: any) => (d.x0 + d.x1) / 2)
            .attr('y', (d: any) => (d.y0 + d.y1) / 2 + fontNumSizeScale(d.data.value)+2)
            .text((d: any) => {
                if (d.data.value > 10000000000) {
                    return d.data.change.toFixed(2)+'%' || '0.0%'
                } else {
                    return '';
                }
            })
            .style('font-size', (d: any) => `${fontNumSizeScale(d.data.value)}px`);
    }

    override render() {
        return html`
            <main>
                <svg class='treemap'><g class="icons"></g></svg>
                <section class='bottom'>
                    <div class='changeStyleTypes'>
                        <div class='categoryChangeBg'>-3%</div>
                        <div class='categoryChangeBg'>-2%</div>
                        <div class='categoryChangeBg'>-1%</div>
                        <div class='categoryChangeBg'>0%</div>
                        <div class='categoryChangeBg'>1%</div>
                        <div class='categoryChangeBg'>2%</div>
                        <div class='categoryChangeBg'>3%</div>
                    </div>
                </section>
            </main>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'treemap-component': TreemapComponent;
    }
}
