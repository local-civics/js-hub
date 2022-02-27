import React from "react";
import { Board, Tab, Widget, WidgetBody } from "../../../../components";

/**
 * The properties for the dashboard.
 */
export type DashboardProps = {
  disabled?: boolean;
  resolving?: boolean;
  active?: "badges" | "tasks";
  onBadgeWorkflow?: () => void;
  onTaskWorkflow?: () => void;
  children?: React.ReactNode;
};

/**
 * A component for highlighting actionable content for residents.
 * @param props
 * @constructor
 */
export const Dashboard = (props: DashboardProps) => {
  const active = props.active || "badges";
  const tabs = (
    <>
      <Tab
        disabled={props.disabled && active !== "badges"}
        icon="badges"
        title="badges"
        active={active === "badges"}
        onClick={props.onBadgeWorkflow}
      />
      {!props.disabled && (
        <Tab icon="activity" title="tasks" active={active === "tasks"} onClick={props.onTaskWorkflow} />
      )}
      {!props.disabled && <Tab disabled icon="cohort" title="groups" />}
    </>
  );
  return (
    <Widget headless>
      <WidgetBody spacing="none">
        <Board tabs={tabs} workflow={props.children} resolving={props.resolving} />
      </WidgetBody>
    </Widget>
  );
};