import React from 'react';
import { Bond, AgentName, AgentResult } from '../types';
import AgentCard from './AgentCard';
import Spinner from './Spinner';

interface AnalysisDashboardProps {
    selectedBond: Bond;
    agentResults: Record<AgentName, AgentResult>;
    isLoading: boolean;
    onRunAnalysis: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ selectedBond, agentResults, isLoading, onRunAnalysis }) => {
    return (
        <main className="flex-1 p-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-nexus-text-primary">{selectedBond.issuer_name}</h2>
                    <p className="text-nexus-text-secondary">{selectedBond.bond_ticker}</p>
                </div>
                <button
                    onClick={onRunAnalysis}
                    disabled={isLoading}
                    className="flex items-center justify-center px-4 py-2 font-semibold text-white bg-nexus-primary rounded-md transition-colors duration-200 hover:bg-nexus-primary-hover disabled:bg-nexus-border disabled:cursor-not-allowed"
                    aria-label={`Run analysis for ${selectedBond.issuer_name}`}
                >
                    {isLoading ? (
                        <>
                            <Spinner />
                            Analyzing...
                        </>
                    ) : (
                        "Run Analysis"
                    )}
                </button>
            </div>

            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                aria-live="polite"
            >
                <AgentCard name={AgentName.Catalyst} result={agentResults[AgentName.Catalyst]} />
                <AgentCard name={AgentName.Valuation} result={agentResults[AgentName.Valuation]} />
                <AgentCard name={AgentName.Covenants} result={agentResults[AgentName.Covenants]} />
            </div>
        </main>
    );
};

export default AnalysisDashboard;
