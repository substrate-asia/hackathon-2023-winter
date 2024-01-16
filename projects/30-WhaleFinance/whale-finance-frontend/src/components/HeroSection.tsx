import React from 'react';

type HeroSectionProps = {
    title: string;
};

const HeroSection: React.FC<HeroSectionProps> = ({ title }) => {
    return (
        <div className="w-full h-24 text-foreground">
            <div className="text-3xl font-bold">{title}</div>
        </div>
    );
};

export default HeroSection;