import React, { FunctionComponent } from "react";
import { Icon } from "../icon";

/**
 * PathwayHelpComponent props
 */
interface PathwayHelpComponentProps {
  onClose: () => void;
  stage: "intro" | "gist" | "farewell";
  onNextStage: () => void;
}

/**
 * Pathway help
 * @param props
 * @constructor
 */
export const PathwayHelpComponent: FunctionComponent<
  PathwayHelpComponentProps
> = (props) => {
  let description = "";
  let title = "";
  switch (props.stage) {
    case "intro":
      title = "Welcome to Pathways";
      description = "An on-ramp to Civic Impact and learning.";
      break;
    case "gist":
      title = "";
      description =
        "You can now select ready made journeys from each of the 5 learning areas to increase your points and earn badges!";
      break;
    case "farewell":
      title = "";
      description =
        "Look for Pathways on the side of your profile and click an area to get started!";
      break;
  }

  return (
    <div className="shadow-md p-5 w-80 lg:w-[28rem] h-64 lg:h-80 bg-white rounded-md grid grid-cols-1 justify-items-center">
      <div className="grid justify-items-end w-full">
        <Icon
          onClick={props.onClose}
          className="transition ease-in-out cursor-pointer stroke-gray-300 fill-gray-300 hover:stroke-gray-400 hover:fill-gray-400 w-4"
          icon="close"
        />
      </div>
      <div className="grid grid-cols-1 m-auto">
        <Icon
          className="m-auto stroke-gray-700 fill-gray-700 w-12 lg:w-16"
          icon="pathway"
        />
        <div className="h-28">
          <p className="w-max m-auto text-gray-700 font-bold text-md lg:text-lg mt-5">
            {title}
          </p>
          <p className="max-w-72 h-16 m-auto text-center text-gray-500 text-xs lg:text-sm mt">
            {description}
          </p>
        </div>
        <div className="w-max m-auto">
          <button
            onClick={props.onNextStage}
            className="transition-colors rounded-lg font-semibold text-white py-3 px-14 bg-sky-400 hover:bg-sky-500 lg:mt-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};