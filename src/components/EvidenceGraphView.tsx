import React, { useState, useEffect } from 'react';
import { GitFork, Layers, CheckCircle2, AlertTriangle, ArrowRight, Shield, Box, User, Truck, FileText } from 'lucide-react';
import { EvidenceGraphData, EvidenceGraphNode, EvidenceGraphEdge } from '../types';

interface EvidenceGraphViewProps {
  caseId: string;
}

export const EvidenceGraphView: React.FC<EvidenceGraphViewProps> = ({ caseId }) => {
  const [graphData, setGraphData] = useState<EvidenceGraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<EvidenceGraphNode | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/cases/${caseId}/evidence-graph`)
      .then(res => res.json())
      .then(res => {
        if (res.nodes && res.edges) {
          setGraphData({ nodes: res.nodes, edges: res.edges });
          setSelectedNode(res.nodes[0] || null);
        }
      })
      .catch(err => console.error('Error fetching evidence graph:', err))
      .finally(() => setLoading(false));
  }, [caseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-[#8E8E8E]">
        Loading Relational Evidence Graph...
      </div>
    );
  }

  if (!graphData) {
    return (
      <div className="p-8 text-center text-xs text-[#8E8E8E]">
        Evidence graph not available for this case.
      </div>
    );
  }

  const types = ['ALL', ...Array.from(new Set(graphData.nodes.map(n => n.type)))];

  const filteredNodes = typeFilter === 'ALL'
    ? graphData.nodes
    : graphData.nodes.filter(n => n.type === typeFilter);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'Case': return <Layers className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Parcel': return <Box className="w-3.5 h-3.5 text-amber-400" />;
      case 'Seal': return <Shield className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Person': return <User className="w-3.5 h-3.5 text-blue-400" />;
      case 'Vehicle': return <Truck className="w-3.5 h-3.5 text-purple-400" />;
      case 'Document': return <FileText className="w-3.5 h-3.5 text-orange-400" />;
      default: return <GitFork className="w-3.5 h-3.5 text-[#8E8E8E]" />;
    }
  };

  // Connected edges for the selected node
  const incomingEdges = selectedNode
    ? graphData.edges.filter(e => e.target === selectedNode.id)
    : [];
  const outgoingEdges = selectedNode
    ? graphData.edges.filter(e => e.source === selectedNode.id)
    : [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#222222] border border-[#3A3A3A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold text-[#ECECEC] uppercase tracking-wider flex items-center gap-2">
            <GitFork className="w-4 h-4 text-indigo-400" />
            Interactive Relational Evidence Graph
          </h3>
          <p className="text-xs text-[#8E8E8E] mt-0.5">
            Interconnecting documents, parcels, official seals, personnel, vehicle, and statutory custody links.
          </p>
        </div>
        <div className="text-xs text-[#B4B4B4] bg-[#1A1A1A] px-3 py-1 rounded-full border border-[#333333]">
          {graphData.nodes.length} Entities • {graphData.edges.length} Typed Relations
        </div>
      </div>

      {/* Filter Types */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              typeFilter === t
                ? 'bg-indigo-600 text-white'
                : 'bg-[#262626] text-[#8E8E8E] hover:text-[#ECECEC] border border-[#3A3A3A]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main Graph Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Entity Node List */}
        <div className="md:col-span-1 space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
          <div className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider mb-2">
            Entities ({filteredNodes.length})
          </div>
          {filteredNodes.map(node => (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between border ${
                selectedNode?.id === node.id
                  ? 'bg-indigo-950/40 border-indigo-500/60 text-[#ECECEC]'
                  : 'bg-[#222222] border-[#333333] hover:border-[#444444] text-[#B4B4B4]'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {getNodeIcon(node.type)}
                <span className="truncate font-medium">{node.label}</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1A1A1A] text-[#8E8E8E] shrink-0">
                {node.type}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Entity Inspector & Connected Edges */}
        <div className="md:col-span-2 space-y-4">
          {selectedNode ? (
            <div className="p-4 rounded-xl bg-[#222222] border border-[#3A3A3A] space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#1A1A1A] border border-[#333333]">
                    {getNodeIcon(selectedNode.type)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                      {selectedNode.type} Entity
                    </span>
                    <h3 className="text-sm font-semibold text-[#ECECEC]">{selectedNode.label}</h3>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedNode.status === 'CONFLICTING'
                      ? 'bg-amber-950/60 text-amber-400 border border-amber-700/50'
                      : 'bg-emerald-950/60 text-emerald-400 border border-emerald-700/50'
                  }`}
                >
                  {selectedNode.status}
                </span>
              </div>

              {selectedNode.details && (
                <div className="p-3 rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] text-xs text-[#CCCCCC]">
                  {selectedNode.details}
                </div>
              )}

              {/* Outgoing Connections */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider flex items-center gap-1">
                  <span>Direct Outgoing Relationships</span>
                  <span className="text-[#666666]">({outgoingEdges.length})</span>
                </div>
                {outgoingEdges.length > 0 ? (
                  <div className="space-y-1.5">
                    {outgoingEdges.map(edge => {
                      const targetNode = graphData.nodes.find(n => n.id === edge.target);
                      return (
                        <div
                          key={edge.id}
                          className="p-2.5 rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-indigo-400 px-1.5 py-0.5 rounded bg-[#252525] border border-[#333333]">
                              {edge.label}
                            </span>
                            <ArrowRight className="w-3 h-3 text-[#666666]" />
                            <span className="text-[#ECECEC] font-medium">
                              {targetNode?.label || edge.target}
                            </span>
                          </div>
                          {edge.status === 'CONFLICTING' && (
                            <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Conflict
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-[#666666] italic">No outgoing relationships mapped.</div>
                )}
              </div>

              {/* Incoming Connections */}
              <div className="space-y-2 pt-2 border-t border-[#2D2D2D]">
                <div className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider flex items-center gap-1">
                  <span>Referenced By (Incoming Relationships)</span>
                  <span className="text-[#666666]">({incomingEdges.length})</span>
                </div>
                {incomingEdges.length > 0 ? (
                  <div className="space-y-1.5">
                    {incomingEdges.map(edge => {
                      const sourceNode = graphData.nodes.find(n => n.id === edge.source);
                      return (
                        <div
                          key={edge.id}
                          className="p-2.5 rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[#ECECEC] font-medium">
                              {sourceNode?.label || edge.source}
                            </span>
                            <ArrowRight className="w-3 h-3 text-[#666666]" />
                            <span className="font-mono text-[10px] font-bold text-indigo-400 px-1.5 py-0.5 rounded bg-[#252525] border border-[#333333]">
                              {edge.label}
                            </span>
                          </div>
                          {edge.status === 'CONFLICTING' && (
                            <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Conflict
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-[#666666] italic">No incoming relationships mapped.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#8E8E8E] border border-dashed border-[#3A3A3A] rounded-xl">
              Select an entity from the list to inspect its relational graph and provenance links.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
