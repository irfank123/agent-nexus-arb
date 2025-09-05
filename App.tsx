import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import BondSelector from './components/BondSelector';
import AnalysisDashboard from './components/AnalysisDashboard';
import FinalReport from './components/FinalReport';
import { BOND_UNIVERSE } from './constants';
import { Bond, AgentName, AgentStatus, AgentResult, CatalystData, ValuationData, CovenantsData } from './types';
import * as geminiService from './services/geminiService';

const INITIAL_AGENT_RESULTS: Record<AgentName, AgentResult> = {
    [AgentName.Catalyst]: { status: AgentStatus.Idle, data: null, error: null },
    [AgentName.Valuation]: { status: AgentStatus.Idle, data: null, error: null },
    [AgentName.Covenants]: { status: AgentStatus.Idle, data: null, error: null },
};

const App = () => {
    const [selectedBond, setSelectedBond] = useState<Bond>(BOND_UNIVERSE[0]);
    const [agentResults, setAgentResults] = useState<Record<AgentName, AgentResult>>(INITIAL_AGENT_RESULTS);
    const [finalReport, setFinalReport] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const handleSelectBond = useCallback((bond: Bond) => {
        setSelectedBond(bond);
        setAgentResults(INITIAL_AGENT_RESULTS);
        setFinalReport(null);
        setGlobalError(null);
        setIsLoading(false);
    }, []);

    const handleRunAnalysis = useCallback(async () => {
        setIsLoading(true);
        setAgentResults(INITIAL_AGENT_RESULTS);
        setFinalReport(null);
        setGlobalError(null);

        let catalystResult: CatalystData;
        let valuationResult: ValuationData;
        let covenantsResult: CovenantsData;

        try {
            // Run Catalyst Agent
            setAgentResults(prev => ({ ...prev, [AgentName.Catalyst]: { status: AgentStatus.Running, data: null, error: null } }));
            catalystResult = await geminiService.runCatalystAgent(selectedBond.underlying_equity_ticker);
            setAgentResults(prev => ({ ...prev, [AgentName.Catalyst]: { status: AgentStatus.Success, data: catalystResult, error: null } }));

            // Run Valuation Agent
            setAgentResults(prev => ({ ...prev, [AgentName.Valuation]: { status: AgentStatus.Running, data: null, error: null } }));
            valuationResult = await geminiService.runValuationAgent(selectedBond.bond_ticker, selectedBond.underlying_equity_ticker, catalystResult.headline);
            setAgentResults(prev => ({ ...prev, [AgentName.Valuation]: { status: AgentStatus.Success, data: valuationResult, error: null } }));

            // Run Covenants Agent
            setAgentResults(prev => ({ ...prev, [AgentName.Covenants]: { status: AgentStatus.Running, data: null, error: null } }));
            covenantsResult = await geminiService.runCovenantsAgent(selectedBond.isin);
            setAgentResults(prev => ({ ...prev, [AgentName.Covenants]: { status: AgentStatus.Success, data: covenantsResult, error: null } }));

            // Generate Final Report
            const report = await geminiService.generateFinalReport(
                JSON.stringify(catalystResult),
                JSON.stringify(valuationResult),
                JSON.stringify(covenantsResult)
            );
            setFinalReport(report);

        } catch (error: any) {
            const errorMessage = error.message || "An unknown error occurred.";
            setGlobalError(`Analysis failed: ${errorMessage}`);
            // Find which agent was running and mark it as failed
            setAgentResults(prev => {
                const currentResults = { ...prev };
                const runningAgent = Object.entries(currentResults).find(([, res]) => res.status === AgentStatus.Running);
                if (runningAgent) {
                    currentResults[runningAgent[0] as AgentName] = { status: AgentStatus.Error, data: null, error: errorMessage };
                }
                return currentResults;
            });
        } finally {
            setIsLoading(false);
        }
    }, [selectedBond]);

    return (
        <div className="min-h-screen flex flex-col bg-nexus-bg">
            <Header />
            <div className="flex flex-1 flex-col lg:flex-row">
                <BondSelector
                    bonds={BOND_UNIVERSE}
                    selectedBond={selectedBond}
                    onSelectBond={handleSelectBond}
                />
                <div className="flex-1 flex flex-col p-4">
                    {globalError && (
                         <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg mb-4">
                            <p className="font-bold">Error</p>
                            <p>{globalError}</p>
                        </div>
                    )}
                    <AnalysisDashboard
                        selectedBond={selectedBond}
                        agentResults={agentResults}
                        isLoading={isLoading}
                        onRunAnalysis={handleRunAnalysis}
                    />
                    <FinalReport report={finalReport} />
                </div>
            </div>
        </div>
    );
};

export default App;
