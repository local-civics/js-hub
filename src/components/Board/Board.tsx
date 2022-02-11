import React from "react";
import { builder } from "../../utils/classname/classname";
import { Loader } from "../Loader/Loader";

/**
 * The properties for tabs.
 */
export type BoardProps = {
  resolving?: boolean;
  secondary?: boolean;
  tabs?: React.ReactNode;
  workflow?: React.ReactNode;
};

/**
 * A component for tabs.
 * @param props
 * @constructor
 */
export const Board = (props: BoardProps) => {
  const className = builder().if(!!props.secondary, "pt-2 px-2").else("p-2 bg-gray-200").build();
  const layoutClassName = builder("grid grid-cols-3 justify-items-center").if(!props.secondary, "gap-2").build();
  const hasWorkflow = props.workflow && React.Children.count(props.workflow) > 0;
  const loaderContainer = builder()
    .if(!!props.secondary && !!props.resolving, "h-[18rem]")
    .if(!props.secondary && !!props.resolving, "h-[21rem]")
    .build();

  return (
    <div className="overflow-hidden w-full">
      <div className={className}>
        <div className={layoutClassName}>{props.tabs}</div>
      </div>
      <div className={loaderContainer}>
        <Loader isLoading={props.resolving}>
          {!hasWorkflow && (
            <div className="grid justify-items-center content-center h-[18rem]">
              <p className="text-xs text-center align-middle leading-6 font-semibold text-slate-300">
                No content to display.
              </p>
            </div>
          )}
          {hasWorkflow && props.workflow}
        </Loader>
      </div>
    </div>
  );
};