import React, { useState, useRef, useEffect } from 'react';
import { TimelineCard } from './TimelineCard';
import { SubstepNode } from './SubstepNode';
import { InfoPanel } from './InfoPanel';
import { TimelineConnector } from './TimelineConnector';

interface SubstepInfo {
  label: string;
  number: number;
  details: string[];
}

interface PhaseInfo {
  title: string;
  description: string;
  substeps: SubstepInfo[];
}

interface PanelPosition {
  x: number;
  y: number;
}

const HoneymanMethod: React.FC = () => {
  const [activePhase, setActivePhase] = useState<string>('');
  const [hoveredPhase, setHoveredPhase] = useState<string>('');
  const [hoveredSubstep, setHoveredSubstep] = useState<number | null>(null);
  const [highlightedSubstep, setHighlightedSubstep] = useState<number | null>(null);
  const [panelPosition, setPanelPosition] = useState<PanelPosition>({ x: 0, y: 0 });
  const methodSectionRef = useRef<HTMLDivElement>(null);

  // PRESERVE EXACT DATA STRUCTURE - DO NOT MODIFY
  const phaseData: Record<string, PhaseInfo> = {
    foundation: {
      title: 'Foundation',
      description: 'Building the groundwork for organizational transformation',
      substeps: [
        {
          label: 'Discovery',
          number: 1,
          details: ['Map current workflows and constraints']
        },
        {
          label: 'Business\nAnalysis',
          number: 2,
          details: ['Identify opportunities and risks']
        },
        {
          label: 'Strategy',
          number: 3,
          details: [
            'Define goals, KPIs, and success criteria',
            'Produce a practical, value-based roadmap'
          ]
        }
      ]
    },
    activation: {
      title: 'Activation',
      description: 'Energizing the organization and driving change',
      substeps: [
        {
          label: 'Approval',
          number: 4,
          details: ['Align stakeholders and secure explicit sign-off']
        },
        {
          label: 'Execution',
          number: 5,
          details: ['Execute in focused tracks with clear owners']
        },
        {
          label: 'Quality Assurance',
          number: 6,
          details: [
            'Validate with QA checkpoints and real metrics',
            'Adapt quickly based on early results'
          ]
        }
      ]
    },
    evolution: {
      title: 'Evolution',
      description: 'Sustaining momentum and continuous improvement',
      substeps: [
        {
          label: 'Sign-Off',
          number: 7,
          details: ['Finalize deliverables and adoption plan']
        },
        {
          label: 'Delivery',
          number: 8,
          details: ['Transfer knowledge and documentation']
        },
        {
          label: 'Continuous Improvement',
          number: 9,
          details: [
            'Track outcomes and iterate deliberately',
            'Feed learnings into the next cycle'
          ]
        }
      ]
    }
  };

  const phases = [
    { id: 'foundation', gradient: 'foundation-grad' },
    { id: 'activation', gradient: 'evolution-grad' },
    { id: 'evolution', gradient: 'activation-grad' }
  ];

  const calculatePanelPosition = (clickX: number, clickY: number): PanelPosition => {
    const PANEL_WIDTH = 400;
    const OFFSET = 20;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Try to position to the right of click
    let x = clickX + OFFSET;
    let y = clickY;

    // If overflows viewport right, position to left of click
    if (x + PANEL_WIDTH > viewportWidth) {
      x = clickX - PANEL_WIDTH - OFFSET;
    }

    // Keep within left boundary
    if (x < OFFSET) {
      x = OFFSET;
    }

    // Keep panel top within viewport
    if (y < OFFSET) {
      y = OFFSET;
    }

    // Keep panel from going off bottom
    if (y + 500 > viewportHeight) {
      y = viewportHeight - 500;
    }

    return { x, y };
  };

  const handlePhaseClick = (phaseId: string, event: React.MouseEvent) => {
    if (activePhase === phaseId) {
      setActivePhase('');
      return;
    }

    // If switching between phases, force close then reopen
    if (activePhase && activePhase !== phaseId) {
      setActivePhase('');
      setTimeout(() => {
        const position = calculatePanelPosition(event.clientX, event.clientY);
        setPanelPosition(position);
        setActivePhase(phaseId);
      }, 50);
    } else {
      const position = calculatePanelPosition(event.clientX, event.clientY);
      setPanelPosition(position);
      setActivePhase(phaseId);
    }
  };

  const handlePhaseHover = (phaseId: string, isHovered: boolean) => {
    setHoveredPhase(isHovered ? phaseId : '');
  };

  const handleClosePanel = () => {
    setActivePhase('');
  };

  const handleSubstepClick = (phaseId: string, substepNumber: number, event: React.MouseEvent) => {
    // If switching between phases, force close then reopen
    if (activePhase && activePhase !== phaseId) {
      setActivePhase('');
      setTimeout(() => {
        const position = calculatePanelPosition(event.clientX, event.clientY);
        setPanelPosition(position);
        setActivePhase(phaseId);
        setHighlightedSubstep(substepNumber);
      }, 50);
    } else {
      const position = calculatePanelPosition(event.clientX, event.clientY);
      setPanelPosition(position);
      setActivePhase(phaseId);
      setHighlightedSubstep(substepNumber);
    }
  };

  const handleSubstepHover = (substepNumber: number | null) => {
    setHoveredSubstep(substepNumber);
  };

  // Clear highlighted substep after 500ms
  useEffect(() => {
    if (highlightedSubstep !== null) {
      const timer = setTimeout(() => {
        setHighlightedSubstep(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [highlightedSubstep]);

  return (
    <div ref={methodSectionRef} className="bg-white py-16 px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-center gap-4 py-8">
          {phases.map((phase, index) => {
            const data = phaseData[phase.id];

            return (
              <React.Fragment key={phase.id}>
                {/* Phase card with substeps */}
                <div className="h-[180px] inline-block" style={{ zIndex: 10 - index }}>
                  <TimelineCard
                    id={phase.id}
                    title={data.title}
                    gradient={phase.gradient}
                    index={index}
                    isActive={activePhase === phase.id}
                    isHovered={hoveredPhase === phase.id}
                    hoveredSubstep={hoveredSubstep}
                    hoveredSubstepText={
                      hoveredSubstep !== null
                        ? data.substeps.find(s => s.number === hoveredSubstep)?.label.replace('\n', ' ') || ''
                        : ''
                    }
                    onClick={(e) => handlePhaseClick(phase.id, e)}
                    onHover={(isHovered) => handlePhaseHover(phase.id, isHovered)}
                  />

                  {/* Substeps directly below card */}
                  <div className="flex gap-6 justify-center mt-3">
                    {data.substeps.map((substep, substepIndex) => (
                      <SubstepNode
                        key={`${phase.id}-${substepIndex}`}
                        substep={substep.label.replace('\n', ' ')}
                        substepNumber={substep.number}
                        index={substepIndex}
                        parentHovered={hoveredPhase === phase.id}
                        onClick={(e) => handleSubstepClick(phase.id, substep.number, e)}
                        onSubstepHover={handleSubstepHover}
                      />
                    ))}
                  </div>
                </div>

                {/* Connector arrow */}
                {index < phases.length - 1 && (
                  <div className="inline-block self-center" style={{ zIndex: 5 }}>
                    <TimelineConnector index={index} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* InfoPanel tooltip-style overlay */}
        {activePhase && (
          <InfoPanel
            key={activePhase}
            isOpen={!!activePhase}
            title={phaseData[activePhase].title}
            description={phaseData[activePhase].description}
            substeps={phaseData[activePhase].substeps.map(substep => ({
              label: substep.label.replace('\n', ' '),
              number: substep.number,
              details: substep.details
            }))}
            highlightedSubstep={highlightedSubstep}
            position={panelPosition}
            onClose={handleClosePanel}
          />
        )}
      </div>
    </div>
  );
};

export default HoneymanMethod;
