import React, { useState } from "react";
import { CodeMirrorEditor } from "../editor/CodeMirrorEditor";
import { WorkspaceSlider } from "./WorkSpaceSlider";
import { EditorDocument, Theme, EditorUpdate, EditorSettings } from "@/types/editor";

interface WorkspaceProps {
  doc: EditorDocument;
  theme: Theme;
  editable?: boolean;
  onChange?: (update: EditorUpdate) => void;
  onSave?: () => void;
  autoFocusOnDocumentChange?: boolean;
  settings?: EditorSettings;
  className?: string;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  doc,
  theme,
  editable = false,
  onChange,
  onSave,
  autoFocusOnDocumentChange,
  settings,
  className,
}) => {
  const [viewMode, setViewMode] = useState<"code" | "preview">("code");

  return (
    <div className="workspace h-full flex flex-col">
      <WorkspaceSlider currentView={viewMode} onChange={setViewMode} />
      <div className="flex-1">
        {viewMode === "code" ? (
          <CodeMirrorEditor
            theme={theme}
            doc={doc}
            editable={editable}
            onChange={onChange}
            onSave={onSave}
            autoFocusOnDocumentChange={autoFocusOnDocumentChange}
            settings={settings}
            className={className}
          />
        ) : (
          <div className="preview h-full flex items-center justify-center text-muted-foreground">
            Preview coming soon...
          </div>
        )}
      </div>
    </div>
  );
};

Workspace.displayName = "Workspace";