export const GRAPH_URL='/src/shared/json/1.json';
export const GRAPH_URL2='/src/shared/json/2.json';
export const GRAPH_URL3='/src/shared/json/3.json';

export const theAddress2 = '0xf3ecf43e3882b19d91646a4852145f8d2317fba2';
export const theAddress3 = '0x6a2b402b710c746de3fc064090ca1eab109a0e31';

export const addressTypeStyles: Record<string, string> = {
    unmarked: 'lightgrey',
    stakingpool: 'lightblue',
    service: 'orange',
    token: 'orange',
    dao: 'purple',
    cex: 'purple',
    gambling: 'pink',
    default: 'purple',
}

export type D3Event<T extends Event, E extends Element> = T & { currentTarget: E }

type Token = {
    name?: string,
    blockchain?: string,
    amount?: number,
    USDT?: number,
}
type Transaction = {
    from?: string,
    to?: string,
    date?: string,
    token?: Token
}
export type Node = {
    address?: string,
    type?: string,
    address_name?: string,
    risk_score?: number | string,
    creator?: boolean,
    creator_addr?: string,
    updated_at?: string,
    created_at?: string,
    tokens?: unknown[],
    balance?: number,
    networks?: string[],
    not_open?: boolean,
    index?: number,
    x?: number | null,
    y?: number | null,
    vy?: number | null,
    vx?: number | null,
};
export type Link = {
    id?: string,
    from?: string,
    to?: string,
    link_from_creator?: boolean,
    balance_delta?: number,
    tokens_balance_delta?: Token[],
    first_transaction?: Transaction,
    transactions?: Transaction[],
    index?: 0,
    source?: Node,
    target?: Node,
};
export type TGraphData = {
    nodes: Node[],
    links: Link[],
    tokens: unknown[],
};

export function shortenAddress(address: string) {
    const start = address.slice(0, 7);
    const end = address.slice(-5);
    return start + '.....' + end;
}
