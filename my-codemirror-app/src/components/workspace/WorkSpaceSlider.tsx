import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorkspaceSliderProps {
  currentView: "code" | "preview";
  onChange: (view: "code" | "preview") => void;
}

export const WorkspaceSlider: React.FC<WorkspaceSliderProps> = ({
  currentView,
  onChange,
}) => {
  return (
    <Tabs value={currentView} onValueChange={v => onChange(v as "code" | "preview")}>
      <TabsList>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};