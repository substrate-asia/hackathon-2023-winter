export const getCssVariable = (variable: string) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variable);
};

export function hslToHex(hsl: string) {
    const [h, s, l] = hsl.split(" ").map((value, index) => 
      index === 0 ? parseFloat(value) : parseInt(value, 10)
    );
  
    const sDecimal = s / 100;
    const lDecimal = l / 100;
    const a = sDecimal * Math.min(lDecimal, 1 - lDecimal);
    const f = (n : any) => {
      const k = (n + h / 30) % 12;
      const color = lDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export const getChartColors = (): Record<string, string> => {
    return {
        backgroundColor: 'transparent',
        lineColor: hslToHex(getCssVariable('--primary')),
        textColor: hslToHex(getCssVariable('--foreground')),
        bkgColor: hslToHex(getCssVariable('--background')),
        areaTopColor: hslToHex(getCssVariable('--primary-lighter')),
        areaBottomColor: hslToHex(getCssVariable('--primary-chart')),
    };
};