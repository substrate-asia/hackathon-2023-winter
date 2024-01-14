import { createChart, ColorType, LineData, Time } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

interface ChartColors {
  backgroundColor?: string;
  bkgColor?: string;
  lineColor?: string;
  textColor?: string;
  areaTopColor?: string;
  areaBottomColor?: string;
}

interface ChartComponentProps {
  data: any[];
  colors?: ChartColors;
}

export const ChartTestComponent: React.FC<ChartComponentProps> = ({ data, colors = {} }) => {

  const backgroundColor = colors.backgroundColor;
  const bkgColor = colors.bkgColor;
  const lineColor = colors.lineColor;
  const textColor = colors.textColor;
  const areaTopColor = colors.areaTopColor;
  const areaBottomColor = colors.areaBottomColor;

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const toolTipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      grid: {
        vertLines: { color: 'rgba(0, 0, 0, 0)' },
        horzLines: { color: 'rgba(0, 0, 0, 0)' },
      },
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addAreaSeries({
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
    });
    newSeries.setData(data);

    chart.subscribeCrosshairMove((param) => {
      const tooltipEl = toolTipRef.current;
      const chartEl = chartContainerRef.current;
    
      if (!tooltipEl || !chartEl) return;
    
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > chartEl.clientWidth ||
        param.point.y < 0 ||
        param.point.y > chartEl.clientHeight
      ) {
        tooltipEl.style.display = 'none';
      } else {
        const dateStr = param.time;
        const data = param.seriesData.get(newSeries);
        const price = (data as LineData<Time>).value ?? 0;
        tooltipEl.innerHTML = `
          <div style="color: rgba(38, 166, 154, 1);">Price</div>
          <div style="font-size: 24px; margin: 4px 0px;">
            ${Math.round(100 * price) / 100}
          </div>
          <div>
            ${dateStr}
          </div>`;

        console.log(param.point.x);
        console.log(param.point.y);
    
        tooltipEl.style.display = 'block';
        let left = param.point.x + 20;
        let top = param.point.y + 20;
    
        const tooltipWidth = 100; // Adjust as per actual tooltip width
        const tooltipHeight = 120; // Adjust as per actual tooltip height

        if (left > chartEl.clientWidth - tooltipWidth) {
          left = param.point.x - tooltipWidth;
        }

        if (top > chartEl.clientHeight - tooltipHeight) {
          top = param.point.y - tooltipHeight;
        }

        tooltipEl.style.left = `${left}px`;
        tooltipEl.style.top = `${top}px`;

        console.log('tooltipEl.style.left', tooltipEl.style.left);
        console.log('tooltipEl.style.top', tooltipEl.style.top);

      }
    });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

  return (
    <div ref={chartContainerRef} id="container" style={{ position: 'relative', height: '300px', width: '100%' }}>
      <div ref={toolTipRef} style={{ 
        width: '120px', 
        height: '100px', 
        position: 'absolute', 
        display: 'none', 
        padding: '8px', 
        boxSizing: 'border-box', 
        fontSize: '12px', 
        textAlign: 'left', 
        zIndex: '1000', 
        top: '12px', 
        left: '12px', 
        pointerEvents: 'none', 
        border: '1px solid', 
        borderRadius: '2px',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif",
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        background: bkgColor,
        color: textColor,
        borderColor: lineColor
      }}>
      </div>
    </div>
  );
};