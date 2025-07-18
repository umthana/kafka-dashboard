import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';

const PhasorPlot = ({ gridData, microgridData }) => {
  const plotData = useMemo(() => {
    const traces = [];

    // Helper function to convert magnitude and angle to cartesian coordinates
    const polarToCartesian = (magnitude, angleDegrees) => {
      const angleRadians = (angleDegrees * Math.PI) / 180;
      return {
        x: magnitude * Math.cos(angleRadians),
        y: magnitude * Math.sin(angleRadians)
      };
    };

    // Grid PMU data
    if (gridData) {
      const gridPhases = [
        { name: 'Grid Va', mag: gridData.va_mag, ang: gridData.va_ang, color: '#FF6B6B' },
        { name: 'Grid Vb', mag: gridData.vb_mag, ang: gridData.vb_ang, color: '#4ECDC4' },
        { name: 'Grid Vc', mag: gridData.vc_mag, ang: gridData.vc_ang, color: '#45B7D1' }
      ];

      gridPhases.forEach(phase => {
        const cart = polarToCartesian(phase.mag, phase.ang);
        traces.push({
          x: [0, cart.x],
          y: [0, cart.y],
          mode: 'lines+markers',
          type: 'scatter',
          name: phase.name,
          line: {
            color: phase.color,
            width: 3
          },
          marker: {
            size: 8,
            color: phase.color
          }
        });
      });
    }

    // Microgrid PMU data
    if (microgridData) {
      const microgridPhases = [
        { name: 'Microgrid Va', mag: microgridData.va_mag, ang: microgridData.va_ang, color: '#FF6B6B', dash: 'dash' },
        { name: 'Microgrid Vb', mag: microgridData.vb_mag, ang: microgridData.vb_ang, color: '#4ECDC4', dash: 'dash' },
        { name: 'Microgrid Vc', mag: microgridData.vc_mag, ang: microgridData.vc_ang, color: '#45B7D1', dash: 'dash' }
      ];

      microgridPhases.forEach(phase => {
        const cart = polarToCartesian(phase.mag, phase.ang);
        traces.push({
          x: [0, cart.x],
          y: [0, cart.y],
          mode: 'lines+markers',
          type: 'scatter',
          name: phase.name,
          line: {
            color: phase.color,
            width: 3,
            dash: phase.dash
          },
          marker: {
            size: 8,
            color: phase.color,
            symbol: 'square'
          }
        });
      });
    }

    // Add circle reference lines
    const circleAngles = Array.from({length: 361}, (_, i) => i * Math.PI / 180);
    const circles = [100, 150, 200, 250];
    
    circles.forEach(radius => {
      const circleX = circleAngles.map(angle => radius * Math.cos(angle));
      const circleY = circleAngles.map(angle => radius * Math.sin(angle));
      
      traces.push({
        x: circleX,
        y: circleY,
        mode: 'lines',
        type: 'scatter',
        name: `${radius}V`,
        line: {
          color: '#E0E0E0',
          width: 1,
          dash: 'dot'
        },
        showlegend: false,
        hoverinfo: 'skip'
      });
    });

    return traces;
  }, [gridData, microgridData]);

  const layout = {
    title: {
      text: '3-Phase Voltage Phasor Diagram',
      font: { size: 18 }
    },
    xaxis: {
      title: 'Real Part (V)',
      range: [-300, 300],
      zeroline: true,
      zerolinecolor: '#000',
      zerolinewidth: 2,
      gridcolor: '#F0F0F0',
      scaleanchor: 'y',
      scaleratio: 1
    },
    yaxis: {
      title: 'Imaginary Part (V)',
      range: [-300, 300],
      zeroline: true,
      zerolinecolor: '#000',
      zerolinewidth: 2,
      gridcolor: '#F0F0F0'
    },
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    showlegend: true,
    legend: {
      x: 1.05,
      y: 1,
      bgcolor: 'rgba(255,255,255,0.8)',
      bordercolor: '#E0E0E0',
      borderwidth: 1
    },
    margin: { l: 60, r: 150, t: 60, b: 60 },
    hovermode: 'closest'
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    toImageButtonOptions: {
      format: 'png',
      filename: 'phasor_plot',
      height: 600,
      width: 800,
      scale: 1
    }
  };

  return (
    <div>
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '500px' }}
      />
      {(!gridData && !microgridData) && (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px', 
          color: '#666',
          fontSize: '16px'
        }}>
          Waiting for PMU data...
        </div>
      )}
    </div>
  );
};

export default PhasorPlot;
