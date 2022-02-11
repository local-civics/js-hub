import React from "react";
import { Widget, WidgetBody, WidgetHeader, WidgetTitle } from "../../../../components";
import { compact } from "../../../../utils/numbers";

/**
 * The properties for the achievement widget.
 */
export interface AchievementWidgetProps {
  resolving?: boolean;
  badges?: number;
  milestones?: number;
  reflections?: number;
}

/**
 * A widget for displaying resident a achievement report.
 * @param props
 * @constructor
 */
export const AchievementWidget = (props: AchievementWidgetProps) => {
  return (
    <Widget height="sm" resolving={props.resolving}>
      <WidgetHeader>
        <WidgetTitle icon="achievements">My Achievements</WidgetTitle>
      </WidgetHeader>
      <WidgetBody>
        <div className="grid grid-cols-3 justify-items-center">
          <div className="justify-self-start">
            <p className="font-bold text-3xl w-max m-auto text-green-500">{compact(props.reflections || 0)}</p>
            <p className="text-xs w-max m-auto text-gray-400">Reflections</p>
          </div>

          <div>
            <p className="font-bold text-3xl w-max m-auto text-green-500">{compact(props.badges || 0)}</p>
            <p className="text-xs w-max m-auto text-gray-400">Badges</p>
          </div>

          <div className="justify-self-end">
            <p className="font-bold text-3xl w-max m-auto text-green-500">{compact(props.milestones || 0)}</p>
            <p className="text-xs w-max m-auto text-gray-400">Materials</p>
          </div>
        </div>
      </WidgetBody>
    </Widget>
  );
};