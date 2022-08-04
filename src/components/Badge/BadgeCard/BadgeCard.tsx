import * as React from "react";

import { Card } from "../../Card";
import { BadgeEmblem } from "../BadgeEmblem/BadgeEmblem";
import { IconName } from "../../Icon/icons";
import { Icon } from "../../Icon/Icon";
import { Button } from "../../Button";

/**
 * BadgeActivityProps
 */
export type BadgeActivityProps = {
  activityId?: string;
  activityName?: string;
  namespace?: string;
  xp?: number;
  formId?: string;
  milestone?: boolean;
  badgeId?: string;
  criterionId?: string;
  completedAt?: string;
  chosenAt?: string;
  startTime?: string;

  onClick?: () => void;
};

/**
 * CriterionProps
 */
export type CriterionProps = {
  criterionId?: string;
  displayName?: string;
  namespace?: string;
  options?: BadgeActivityProps[];
};

/**
 * BadgeCardProps
 */
export type BadgeCardProps = {
  icon?: IconName;
  displayName?: string;
  imageURL?: string;
  level?: number;
  summary?: string;
  criteria?: CriterionProps[];
  choices?: BadgeActivityProps[];
  canSubmit?: boolean;

  onMoreChoices?: () => void;
  onClose?: () => void;
  onSubmit?: () => void;
};

/**
 * BadgeCard
 * @param props
 * @constructor
 */
export const BadgeCard = (props: BadgeCardProps) => {
  const criteria = props.criteria || [];
  const choices: any = {};
  const criteriaNames = criteria.map((c) => c.displayName);
  let xp = 0;
  let completed = 0;
  props.choices?.map((c, i) => {
    const id = c.criterionId || i;
    choices[id] = c;
    xp += c.xp || 0;
    if (c.completedAt) {
      completed += 1;
    }
  });

  return (
    <Card onClose={props.onClose}>
      <div className="pb-5 text-zinc-600">
        <div className="pb-5 px-5 flex gap-x-2 border-b border-zinc-200">
          <BadgeEmblem
            icon={props.icon}
            imageURL={props.imageURL}
            alt={props.displayName}
            level={props.level}
            size="sm"
          />
          <div className="max-w-[20rem]">
            <p className="font-semibold">{props.displayName}</p>
            <div className="text-xs">
              <span className="text-zinc-500 font-semibold">Level {(props.level || 0) + 1}.</span>
              {xp && (
                <div className="inline-block ml-1 text-green-500">
                  <span className="font-semibold">{xp}</span>
                  <span className="ml-1">XP</span>
                </div>
              )}
            </div>
            {props.summary && <p className="mt-2 text-sm">{props.summary}</p>}
          </div>
        </div>
        {criteriaNames.length > 0 && (
          <div className="p-5 grid grid-cols-1 gap-y-3 max-w-[30rem] border-b border-zinc-200">
            <p className="font-semibold">Badge Criteria</p>
            <p className="text-xs">Complete 1 of each: {criteriaNames.join(", ")}</p>

            <div className="mt-2 grid grid-cols-1 gap-y-8 max-h-[18rem] overflow-y-auto">
              {criteria.map((c, i) => {
                const id = c.criterionId || i;
                const choice = choices[id];
                const buttonText = choice?.completedAt ? "Review" : "Start";
                const buttonTheme = choice?.completedAt ? "light" : "dark";
                const iconName = choice?.completedAt ? "check & circle" : "circle";
                const iconColor = choice?.completedAt ? "text-green-500" : "text-zinc-300";

                return (
                  choice && (
                    <div key={id} className="flex gap-x-2 items-center">
                      <div className={`shrink-0 h-4 w-4 ${iconColor}`}>
                        <Icon name={iconName} />
                      </div>
                      <div className="grow">
                        <div>
                          <span className="font-semibold">{choice.activityName}</span>
                          <span
                            onClick={props.onMoreChoices}
                            className="align-middle ml-1 text-xs cursor-pointer underline text-sky-600 hover:text-sky-700"
                          >
                            (More Choices)
                          </span>
                        </div>
                        <div className="text-xs">
                          <span>{c.displayName}</span>
                          {choice.xp && <span className="ml-1 text-green-500 font-semibold">{choice.xp} points</span>}
                        </div>
                      </div>
                      <div className="shrink-0 w-full max-w-[7rem]">
                        <Button
                          onClick={choice.onClick}
                          spacing="sm"
                          border="rounded"
                          size="full:sm"
                          color="blue"
                          theme={buttonTheme}
                          text={buttonText}
                        />
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        )}
        <div className="pt-5 px-5 flex">
          <div className="w-full max-w-[7rem] ml-auto">
            <Button
              disabled={!props.canSubmit && completed < criteria.length}
              onClick={props.onSubmit}
              spacing="sm"
              border="rounded"
              size="full:sm"
              color="blue"
              theme="dark"
              text="Submit"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
