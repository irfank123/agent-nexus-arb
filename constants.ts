import { Bond } from './types';

export const BOND_UNIVERSE: Bond[] = [
    {
        isin: 'US12345ABCDE',
        cusip: '12345ABCD',
        bond_ticker: 'AMZN 2.5 08/29/27',
        underlying_equity_ticker: 'AMZN',
        issuer_name: 'Amazon.com, Inc.',
    },
    {
        isin: 'US54321FEDCB',
        cusip: '54321FEDC',
        bond_ticker: 'TSLA 1.25 03/01/26',
        underlying_equity_ticker: 'TSLA',
        issuer_name: 'Tesla, Inc.',
    },
    {
        isin: 'US98765ZYXWV',
        cusip: '98765ZYXW',
        bond_ticker: 'GOOG 2.0 05/15/28',
        underlying_equity_ticker: 'GOOGL',
        issuer_name: 'Alphabet Inc.',
    },
    {
        isin: 'US112233ABBC',
        cusip: '112233ABB',
        bond_ticker: 'MSFT 1.55 12/01/25',
        underlying_equity_ticker: 'MSFT',
        issuer_name: 'Microsoft Corporation',
    },
];
