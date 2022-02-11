import React from "react";
import { Loader, Modal } from "../../../../components";

type Grade = "k-5th" | "6th" | "7th" | "8th" | "9th" | "10th" | "11th" | "12th";

/**
 * The properties for the edit modal.
 */
export type EditModalProps = {
  saving?: boolean;
  visible?: boolean;
  onClose?: () => void;
  onSave?: (resident?: ResidentState) => void;
};

export type ResidentState = {
  avatarURL?: string;
  residentName?: string;
  givenName?: string;
  familyName?: string;
  grade?: Grade;
  impactStatement?: string;
  accessToken?: string | null;
};

/**
 * A component for viewing/editing resident settings.
 * @param props
 * @constructor
 */
export const EditModal = (props: EditModalProps & ResidentState) => {
  // https://stackoverflow.com/questions/55075604/react-hooks-useeffect-only-on-update
  const [avatarURL, setAvatarURL] = React.useState(undefined as string | undefined);
  const [residentName, setResidentName] = React.useState(undefined as string | undefined);
  const [givenName, setGivenName] = React.useState(undefined as string | undefined);
  const [familyName, setFamilyName] = React.useState(undefined as string | undefined);
  const [grade, setGrade] = React.useState(undefined as Grade | undefined);
  const [impactStatement, setImpactStatement] = React.useState(undefined as string | undefined);
  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let reader = new FileReader();
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setAvatarURL(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };
  const hasChanges =
    (residentName && residentName !== props.residentName) ||
    (givenName && givenName !== props.givenName) ||
    (familyName && familyName !== props.familyName) ||
    (grade && grade !== props.grade) ||
    (impactStatement && impactStatement !== props.impactStatement) ||
    (avatarURL && avatarURL !== props.avatarURL);

  const onSave = () =>
    hasChanges &&
    props.onSave &&
    props.onSave({
      residentName: residentName,
      givenName: givenName,
      familyName: familyName,
      grade: grade,
      impactStatement: impactStatement,
      avatarURL: avatarURL,
    });

  return (
    <Modal
      embed
      width="lg"
      visible={props.visible}
      title="Settings"
      variant="input"
      cta={!props.saving && hasChanges ? "save" : ""}
      onCTAClick={onSave}
      onClose={props.onClose}
    >
      <div className="min-h-9">
        <Loader isLoading={props.saving}>
          {!props.saving && (
            <div className="grid grid-cols-1 w-full px-2 gap-6">
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  <img
                    className="h-16 w-16 object-cover rounded-full"
                    src={avatarURL || props.avatarURL || "https://cdn.localcivics.io/hub/avatar.jpg"}
                    alt="Current profile photo"
                  />
                </div>
                <label className="block">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    onChange={(e) => onAvatarChange(e)}
                    name="avatar"
                    type="file"
                    className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
                  />
                </label>
              </div>

              <div className="w-full">
                <p className="mb-2 w-full font-semibold text-slate-500 text-xs">Username</p>
                <input
                  min={6}
                  max={30}
                  onChange={(e) => setResidentName(e.target.value)}
                  defaultValue={props.residentName}
                  className="mt-1 block w-full px-3 py-2 bg-white text-slate-500 focus:text-slate-600 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
        disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
        invalid:border-pink-500 invalid:text-pink-600
        focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                />
              </div>

              <div className="w-full">
                <p className="mb-2 w-full font-semibold text-slate-500 text-xs">First Name</p>
                <input
                  onChange={(e) => setGivenName(e.target.value)}
                  defaultValue={props.givenName}
                  className="mt-1 block w-full px-3 py-2 bg-white text-slate-500 focus:text-slate-600 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
        disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
        invalid:border-pink-500 invalid:text-pink-600
        focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                />
              </div>

              <div className="w-full">
                <p className="mb-2 w-full font-semibold text-slate-500 text-xs">Last Name</p>
                <input
                  onChange={(e) => setFamilyName(e.target.value)}
                  defaultValue={props.familyName}
                  className="mt-1 block w-full px-3 py-2 bg-white text-slate-500 focus:text-slate-600 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
        disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
        invalid:border-pink-500 invalid:text-pink-600
        focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                />
              </div>

              <div className="w-full">
                <p className="mb-2 w-full font-semibold text-slate-500 text-xs">Grade</p>
                <select
                  onChange={(e) => setGrade(e.target.value as Grade | undefined)}
                  defaultValue={props.grade}
                  className="appearance-none mt-1 block w-full px-3 py-2 bg-white text-slate-500 focus:text-slate-600 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
        disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
        invalid:border-pink-500 invalid:text-pink-600
        focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                >
                  <option>Select a grade</option>
                  <option value="6th">6th</option>
                  <option value="7th">7th</option>
                  <option value="8th">8th</option>
                  <option value="9th">9th</option>
                  <option value="10th">10th</option>
                  <option value="11th">11th</option>
                  <option value="12th">12th</option>
                </select>
              </div>

              <div className="w-full">
                <p className="mb-2 w-full font-semibold text-slate-500 text-xs">Impact Statement</p>
                <textarea
                  onChange={(e) => setImpactStatement(e.target.value)}
                  defaultValue={props.impactStatement}
                  className="resize-none text-slate-500 focus:text-slate-600 h-24 mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
        disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
        invalid:border-pink-500 invalid:text-pink-600
        focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                />
              </div>

              <div className="w-full">
                <p className="mb-2 w-full font-semibold text-slate-500 text-xs">Access Token</p>
                <input
                  disabled
                  defaultValue={props.accessToken || ""}
                  className="mt-1 block w-full px-3 py-2 bg-white text-slate-500 focus:text-slate-600 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
        disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
        invalid:border-pink-500 invalid:text-pink-600
        focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                />
              </div>
            </div>
          )}
        </Loader>
      </div>
    </Modal>
  );
};
