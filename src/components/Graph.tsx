/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3'
import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { D3Event, GRAPH_URL, GRAPH_URL2, GRAPH_URL3, Node, TGraphData, addressTypeStyles, shortenAddress, theAddress2, theAddress3 } from '../shared/graphConstants'


@customElement('graph-component')
export class GraphComponent extends LitElement {
    static styles = css`
        * {
            min-height: 180vh;
        }
        main {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        svg {
            width: 100%;
            height: 100%;
        }
    `;

    private svg!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    private data: TGraphData = { nodes: [], links: [], tokens: [] };
    private prevList: string[] = [];

    constructor() {
        super();
    }

    async fetchNewGraphData(d: Node) {
        try {
        const theURL = `/some_url/${d.address}`;
        const theAddress = d.address === theAddress2
            ? GRAPH_URL2
            : d.address === theAddress3
            ? GRAPH_URL3
            : theURL;

        const response = await fetch(theAddress);
        const newData = await response.json();

        this.data = {
            ...this.data,
            nodes: [...this.data.nodes, ...newData.nodes,],
            links: Array.from(new Map([...this.data.links, ...newData.links,].map(item => [item.id, item])).values())
        };
        d.address && this.prevList.push(d.address);

        this.createGraph();
        return;
        } catch (error) {
        console.error(error);
        return;
        }
    }

    async firstUpdated(): Promise<void> {
        const response = await fetch(GRAPH_URL);
        this.data = await response.json();
        this.createGraph();
    }

    private createGraph() {
        const width = 500;
        const height = 300;

        (this.svg as any) = d3.select(this.shadowRoot!.querySelector('svg') as SVGSVGElement);

        const links = this.data.links.map(link => ({
        source: this.data.nodes.find(node => node.address === link.from),
        target: this.data.nodes.find(node => node.address === link.to),
        ...link
        }));

        const simulation = d3
            .forceSimulation(this.data.nodes as d3.SimulationNodeDatum[])
            .force('link', d3.forceLink(links as any).id(d => (d as any).id))
            .force('charge', d3.forceManyBody().strength(-2400))
            .force('center', d3.forceCenter(width, height))

        const link = this.svg
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('stroke', 'lightgray')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', '2.5px')
            .style("stroke-dasharray", ("3, 3"))

        const node = this.svg
            .selectAll('g')
            .data(this.data.nodes)
            .enter()
            .append('g')
            .call((d3.drag() as any)
                .on('start', (event: D3Event<any, SVGGElement>, d:any) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
                })
                .on('drag', (event:D3Event<MouseEvent, SVGGElement>, d:any) => {
                d.fx = event.x;
                d.fy = event.y;
                })
            )
            .on('click', (event: D3Event<MouseEvent, SVGGElement>, d: any)=> {
                event.preventDefault()
                if(this.prevList.includes(d.address)) return;
                if(d.address === theAddress2 || d.address === theAddress3){
                this.fetchNewGraphData(d)
                }
                return;
            })

        node.append('circle')
            .attr('r', 14)
            .attr('fill', (d) => addressTypeStyles[d.type || 'default']);

        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', (d) => d.address_name ? 30 : 0)
            .text((d) => d.address_name ? d.address_name : '');

        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', (d) => d.address_name ? 45 : 30)
            .text((d) => `${shortenAddress(d.address || '')}`);

        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', (d) => d.address_name ? 60 : 45)
            .text((d:any) => `${d.risk_score.toFixed(1)}`);

        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', 5)
            .style('font-weight', 'bold')
            .attr('fill', 'white')
            .text((d) => d.not_open ? '' : '+' )
            .on('mouseover', function() {
                d3.select(this).style('cursor', 'default');
            });

        simulation.on('tick', () => {
            link
                .attr('x1', (d) => (d.source as any).x)
                .attr('y1', (d) => (d.source as any).y)
                .attr('x2', (d) => (d.target as any).x)
                .attr('y2', (d) => (d.target as any).y);

            node.attr('transform', (d) => `translate(${d.x},${d.y})`);
        });
    }

    override render() {
        return html`
            <main>
                <svg>
                </svg>
            </main>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'graph-component': GraphComponent;
    }
}
