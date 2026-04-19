import type { DemoType } from '../../data/chapters';
import type { ReactElement } from 'react';
import { AgentLoopDemo } from './AgentLoopDemo';
import { AttentionDemo } from './AttentionDemo';
import { ContextCompressionDemo } from './ContextCompressionDemo';
import { DecisionMatrixDemo } from './DecisionMatrixDemo';
import { SequenceDecayDemo } from './SequenceDecayDemo';
import { TimelineDemo } from './TimelineDemo';
import { ToolCallFlowDemo } from './ToolCallFlowDemo';

interface DemoRendererProps {
  type: DemoType;
}

export function DemoRenderer({ type }: DemoRendererProps) {
  const demos: Record<DemoType, ReactElement> = {
    timeline: <TimelineDemo />,
    'sequence-decay': <SequenceDecayDemo />,
    attention: <AttentionDemo />,
    'decision-matrix': <DecisionMatrixDemo />,
    'tool-call-flow': <ToolCallFlowDemo />,
    'context-compression': <ContextCompressionDemo />,
    'agent-loop': <AgentLoopDemo />,
  };

  return demos[type];
}
