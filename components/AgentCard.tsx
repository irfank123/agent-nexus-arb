import React from 'react';
import { AgentName, AgentResult, AgentStatus, CatalystData, ValuationData, CovenantsData } from '../types';
import Spinner from './Spinner';

interface AgentCardProps {
    name: AgentName;
    result: AgentResult;
}

const StatusIndicator: React.FC<{ status: AgentStatus }> = ({ status }) => {
    switch (status) {
        case AgentStatus.Running:
            return <div className="flex items-center text-blue-400"><Spinner /> Running...</div>;
        case AgentStatus.Success:
            return <div className="font-semibold text-green-400">Success</div>;
        case AgentStatus.Error:
            return <div className="font-semibold text-red-400">Error</div>;
        case AgentStatus.Idle:
        default:
            return <div className="text-nexus-text-tertiary">Idle</div>;
    }
};

const AgentCard: React.FC<AgentCardProps> = ({ name, result }) => {

    const renderContent = () => {
        if (result.status !== AgentStatus.Success || !result.data) {
            if (result.status === AgentStatus.Error) {
                return <p className="text-red-400 text-sm p-4">{result.error}</p>;
            }
            return <div className="min-h-[100px]"></div>; // Placeholder for height consistency
        }

        const data = result.data;

        const renderCatalystData = (d: CatalystData) => (
            <>
                <p><span className="font-semibold text-nexus-text-secondary">Headline:</span> {d.headline}</p>
                <p><span className="font-semibold text-nexus-text-secondary">Source:</span> {d.source}</p>
                <p className="mt-2 italic">"{d.analysis}"</p>
            </>
        );

        const renderValuationData = (d: ValuationData) => (
            <>
                <p><span className="font-semibold text-nexus-text-secondary">Market Price:</span> ${d.marketPrice.toFixed(2)}</p>
                <p><span className="font-semibold text-nexus-text-secondary">Theoretical Value:</span> ${d.theoreticalValue.toFixed(2)}</p>
                <p><span className="font-semibold text-nexus-text-secondary">Mispricing:</span> <span className="text-green-400">{d.mispricingPct.toFixed(2)}%</span></p>
                <p><span className="font-semibold text-nexus-text-secondary">Implied Volatility:</span> {d.volatility.toFixed(1)}%</p>
                <p><span className="font-semibold text-nexus-text-secondary">Parity Value:</span> ${d.parityValue.toFixed(2)}</p>
                <p className="mt-2 italic">"{d.summary}"</p>
            </>
        );

        const renderCovenantsData = (d: CovenantsData) => (
            <>
                <p><span className="font-semibold text-nexus-text-secondary">Make-Whole Provision:</span> <span className={d.hasMakeWhole ? 'text-green-400' : 'text-red-400'}>{d.hasMakeWhole ? 'Yes' : 'No'}</span></p>
                <p><span className="font-semibold text-nexus-text-secondary">Put Option @ 101:</span> <span className={d.hasPutOption ? 'text-green-400' : 'text-red-400'}>{d.hasPutOption ? 'Yes' : 'No'}</span></p>
                <p className="mt-2 italic">"{d.covenantSummary}"</p>
            </>
        );

        return (
            <div className="p-4 space-y-2 text-sm">
                {name === AgentName.Catalyst && renderCatalystData(data)}
                {name === AgentName.Valuation && renderValuationData(data)}
                {name === AgentName.Covenants && renderCovenantsData(data)}
            </div>
        );
    };

    return (
        <div className="bg-nexus-bg rounded-lg border border-nexus-border flex flex-col min-h-[180px]">
            <div className="flex justify-between items-center p-3 border-b border-nexus-border/50">
                <h3 className="font-semibold text-nexus-text-primary">{name}</h3>
                <StatusIndicator status={result.status} />
            </div>
            {renderContent()}
        </div>
    );
};

export default AgentCard;
