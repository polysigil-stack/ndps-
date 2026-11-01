import React from 'react';
import { PanelLeft, FileText, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';

interface TopBarProps {
  onToggleSidebar: () => void;
  attachedCaseTitle?: string | null;
  onOpenCaseModal?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleSidebar,
  attachedCaseTitle,
  onOpenCaseModal
}) => {
  return (
    <header
      id="app-topbar"
      className="sticky top-0 z-30 h-11 bg-[#212121] px-3 sm:px-4 flex items-center justify-between gap-3 select-none border-b border-[#3A3A3A]"
    >
      {/* Left: Sidebar toggle + Clean Product Logo & Name */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-[#8E8E8E] hover:text-[#ECECEC] hover:bg-[#2A2A2A] transition-colors cursor-pointer"
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="w-4 h-4" aria-hidden="true" />
        </button>

        <Logo size="xs" showSubtitle={false} />
      </div>

      {/* Right: FIR Case Context Badge + Knowledge Base Status */}
      <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-[#B4B4B4] font-normal select-none">
        {onOpenCaseModal && (
          <button
            type="button"
            onClick={onOpenCaseModal}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
              attachedCaseTitle
                ? 'bg-[#2A2A2A] border-[#3A3A3A] text-[#ECECEC] hover:border-[#8E8E8E]'
                : 'bg-transparent border-dashed border-[#3A3A3A] text-[#8E8E8E] hover:text-[#B4B4B4] hover:border-[#8E8E8E]'
            }`}
            title="Manage attached FIR case context"
          >
            <FileText className="w-3 h-3 text-[#8E8E8E]" />
            <span className="font-medium">
              {attachedCaseTitle ? `Case: ${attachedCaseTitle}` : '+ Attach Case Context'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#8E8E8E]" />
          </button>
        )}

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#8E8E8E]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8E8E8E]" aria-hidden="true" />
          <span>NDPS RAG</span>
        </div>
      </div>
    </header>
  );
};


