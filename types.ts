export interface Bond {
    isin: string;
    cusip: string;
    bond_ticker: string;
    underlying_equity_ticker: string;
    issuer_name: string;
}

export enum AgentName {
    Catalyst = "Catalyst (M&A Event Analyst)",
    Valuation = "Valuation (Quantitative Analyst)",
    Covenants = "Covenants (Legal Structure Analyst)",
}

export enum AgentStatus {
    Idle = 'idle',
    Running = 'running',
    Success = 'success',
    Error = 'error',
}

export interface AgentResult {
    status: AgentStatus;
    data: any | null;
    error: string | null;
}

export interface CatalystData {
    headline: string;
    source: string;
    analysis: string;
}

export interface ValuationData {
    marketPrice: number;
    theoreticalValue: number;
    mispricingPct: number;
    volatility: number;
    parityValue: number;
    summary: string;
}

export interface CovenantsData {
    covenantSummary: string;
    hasMakeWhole: boolean;
    hasPutOption: boolean;
}
