import React from 'react';
import { NexusLogo } from './Icons';

const Header = () => {
    return (
        <header className="sticky top-0 z-10 bg-nexus-surface/50 backdrop-blur-sm border-b border-nexus-border">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <NexusLogo />
                        <h1 className="text-xl font-bold text-nexus-text-primary">
                            Project Nexus
                        </h1>
                    </div>
                    <p className="hidden md:block text-nexus-text-secondary">
                        Convertible Bond Arbitrage Engine
                    </p>
                </div>
            </div>
        </header>
    );
};

export default Header;
