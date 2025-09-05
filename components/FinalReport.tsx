import React from 'react';

interface FinalReportProps {
    report: string | null;
}

const FinalReport: React.FC<FinalReportProps> = ({ report }) => {
    if (!report) {
        return null;
    }

    return (
        <div className="mt-8">
            <div className="bg-nexus-surface rounded-lg border border-nexus-primary/50 p-6">
                <h2 className="text-xl font-bold text-nexus-text-primary mb-4">Final Investment Report</h2>
                <div className="font-mono whitespace-pre-wrap text-nexus-text-secondary">
                    {report}
                </div>
            </div>
        </div>
    );
};

export default FinalReport;
