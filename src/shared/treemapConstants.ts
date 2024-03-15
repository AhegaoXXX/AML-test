/* eslint-disable @typescript-eslint/no-explicit-any */

const apiKey = 'CG-qtbzUkA2AUdPz1bHRveoJQVy';
export const TREEMAP_URL = 'https://api.coingecko.com/api/v3/coins/categories';

export const options = {
    method: 'GET',
    headers: { 'x-cg-demo-api-key': apiKey },
};

type Category = {
    id?: string,
    name?: string,
    market_cap?: number,
    market_cap_change_24h?: number,
    content?: string | null,
    top_3_coins?: string[],
    volume_24h?: number,
    updated_at?: string,
};

export type TTreemapData = Category[];

export const bgStyles = {
    negativeMost: '#F63538',
    negativeMore: '#BF4045',
    negative: '#8B444E',
    zero: '#414554',
    positive: '#35764E',
    positiveMore: '#2F9E4F',
    positiveMost: '#30D05B',
}

export const marketChangeBgStyle = (value:number) => {
    if(value >= 3){
        return bgStyles.positiveMost;
    } else if(value >= 2 && value < 3){
        return bgStyles.positiveMore;
    } else if(value >= 1 && value < 2){
        return bgStyles.positiveMore;
    } else if(value === 0){
        return bgStyles.zero;
    } else if(value <= -1 && value > -2){
        return bgStyles.negative;
    } else if(value <= -2 && value > -3){
        return bgStyles.negativeMore;
    } else if(value <= -3){
        return bgStyles.negativeMost;
    }
    return bgStyles.zero;
}
