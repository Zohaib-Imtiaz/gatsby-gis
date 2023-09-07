import * as React from "react";
import "./simple.css";

interface ToolTip {
  tooltip: React.ReactNode;
  children: React.ReactNode;
}

export const SimpleToolTip = ({ tooltip, children }: ToolTip) => {
  return (
    <div className="simple_tooltip">
      {children}
      <div className="left">
        {tooltip}
        {/* <i></i> */}
      </div>
    </div>
  );
};
