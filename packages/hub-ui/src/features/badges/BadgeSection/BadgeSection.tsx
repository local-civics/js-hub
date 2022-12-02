import * as React from "react";
import { Widget, WidgetBody, WidgetHeader } from "../../../components/Widget";
import {Badge, BadgeProps} from "../Badge/Badge"
import { Icon } from "../../../components/Icon/Icon";

/**
 * BadgeSectionProps
 */
export type BadgeSectionProps = {
  isLoading?: boolean;
  readonly?: boolean;
  showMore?: boolean;
  badges?: BadgeProps[];
};

/**
 * BadgeSection
 * @param props
 * @constructor
 */
export const BadgeSection = (props: BadgeSectionProps) => {
  const [showMore, setShowMore] = React.useState(props.showMore);
  const badges = props.badges || [];
  const progress: BadgeProps[] = [];
  const locked: BadgeProps[] = [];
  const available: BadgeProps[] = [];
  const collected: BadgeProps[] = [];
  const toggleShowMore = () => {
    if (!props.readonly && badges.length > 0) {
      setShowMore(!showMore);
    }
  };

  React.useEffect(() => {
    setShowMore(props.showMore);
  }, [props.showMore]);
  badges.map((b) => {
    if (b.finishedAt) {
      collected.push(b);
    } else if (b.isLocked) {
      locked.push(b);
    } else if (b.startedAt) {
      progress.push(b);
    } else {
      available.push(b);
    }
  });

  const preview = props.readonly ? collected.slice(0, 10) : badges.slice(0, 3);

  return (
    <div className="max-w-[52rem]">
      <Widget isLoading={props.isLoading}>
        <WidgetHeader divide>
          <div className="p-2 flex w-full gap-x-2 text-zinc-600">
            <div className="shrink-0 h-10 w-10">
              <Icon name="award ribbon" />
            </div>
            <p className="shrink-0 my-auto font-semibold">Badges</p>

            <div className="shrink-0 mt-auto ml-auto text-sm">
              <span className="font-semibold">
                {collected.length}{props.readonly ? "" : "/" + badges.length} Badges
              </span>
              <span className="ml-1">collected</span>
            </div>
          </div>
        </WidgetHeader>
        <WidgetBody>
          <div className="pt-2 pb-5 px-2">
            {!props.readonly &&
                <div className="p-2 flex w-full gap-x-2 text-zinc-600">
                  <div
                      onClick={toggleShowMore}
                      className="shrink-0 flex w-max ml-auto text-sm cursor-pointer text-zinc-400 hover:text-zinc-500"
                  >
                    <span>Show more</span>
                    <div className="inline-block ml-1 overflow-hidden h-5 w-5">
                      <Icon name="up & down arrow"/>
                    </div>
                  </div>
                </div>
            }

            {!showMore && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {preview.map((b, i) => {
                  return <Badge key={i} {...b} readonly={props.readonly} />;
                })}
              </div>
            )}
            {showMore && (
              <div className="text-zinc-600 grid grid-cols-1 gap-y-4">
                {progress.length > 0 && (
                  <div>
                    <p className="mb-3 font-semibold">In Progress</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {progress.map((b, i) => {
                        return <Badge key={i} {...b} />;
                      })}
                    </div>
                  </div>
                )}

                {collected.length > 0 && (
                  <div>
                    <p className="mb-3 font-semibold">Collected</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {collected.map((b, i) => {
                        return <Badge key={i} {...b} />;
                      })}
                    </div>
                  </div>
                )}

                {available.length > 0 && (
                  <div>
                    <p className="mb-3 font-semibold">Available</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {available.map((b, i) => {
                        return <Badge key={i} {...b} />;
                      })}
                    </div>
                  </div>
                )}

                {locked.length > 0 && (
                  <div>
                    <p className="mb-3 font-semibold">Locked</p>
                    <div className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto">
                      {locked.map((b, i) => {
                        return <Badge key={i} {...b} />;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </WidgetBody>
      </Widget>
    </div>
  );
};
