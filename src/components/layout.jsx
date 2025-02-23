import  { useState } from "react";
import PropTypes from "prop-types";
import  LeftSidebar  from "./leftsidebar";
import { StatusBar } from "./status-bar";
import { TerminalPanel } from "./terminal-panel";
import { CommandPalette } from "./command-palette";
import { RightSidebar } from "./rightsidebar";
import { TerminalProvider } from "@/hooks/modal-context";

export function Layout({ children }) {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(true);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(true);

  return (
    <TerminalProvider>
    <div className="flex h-screen bg-background space-background text-foreground">
      <LeftSidebar
        isCollapsed={isLeftSidebarCollapsed}
        onToggle={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto p-6">{children}</main>
        <TerminalPanel distroName="debian" />
        <StatusBar />
      </div>
      <RightSidebar
        isCollapsed={isRightSidebarCollapsed}
        onToggle={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
      />
      <CommandPalette />
    </div>
    </TerminalProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
