import  { useState } from "react";
import PropTypes from "prop-types";
import  LeftSidebar  from "./leftsidebar";
import { StatusBar } from "./status-bar";
import { TerminalPanel } from "./terminal-panel";
import { CommandPalette } from "./command-palette";
import { TerminalProvider } from "@/hooks/modal-context";
import { RightSidebar } from "./rightsidebar";
import { RightSidebarProvider } from "@/hooks/right-sidebar";

export function Layout({ children }) {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(true);



  return (
    <TerminalProvider>
      <RightSidebarProvider>
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
      <RightSidebar  />
      <CommandPalette />
    </div>
    </RightSidebarProvider>
    </TerminalProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
