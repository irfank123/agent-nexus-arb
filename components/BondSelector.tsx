import React from 'react';
import { Bond } from '../types';

interface BondSelectorProps {
    bonds: Bond[];
    selectedBond: Bond;
    onSelectBond: (bond: Bond) => void;
}

const BondSelector: React.FC<BondSelectorProps> = ({ bonds, selectedBond, onSelectBond }) => {
    return (
        <aside className="w-full lg:w-1/4 xl:w-1/5 p-4">
            <div className="bg-nexus-surface rounded-lg border border-nexus-border p-4">
                <h2 className="text-lg font-semibold text-nexus-text-primary mb-4">Bond Universe</h2>
                <div className="space-y-2">
                    {bonds.map((bond) => {
                        const isSelected = bond.isin === selectedBond.isin;
                        const selectedClasses = 'bg-nexus-primary/20 border-nexus-primary text-nexus-text-primary';
                        const defaultClasses = 'bg-nexus-bg border-transparent hover:bg-nexus-border/50';

                        return (
                            <button
                                key={bond.isin}
                                onClick={() => onSelectBond(bond)}
                                className={`w-full text-left p-3 rounded-md border transition-colors duration-200 ${isSelected ? selectedClasses : defaultClasses}`}
                                aria-current={isSelected ? 'true' : 'false'}
                            >
                                <p className="font-semibold">{bond.issuer_name}</p>
                                <p className="text-sm text-nexus-text-secondary">{bond.bond_ticker}</p>
                                <p className="text-xs text-nexus-text-tertiary mt-1">
                                    Equity: {bond.underlying_equity_ticker} | ISIN: {bond.isin}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};

export default BondSelector;
