import * as React           from "react"
import {LoaderIcon}         from "../../../components";
import {changeSet, withKey} from "../../../utils/form";
import {ConfirmDialog} from "../../components/ConfirmDialog/ConfirmDialog";
import {FormInput}     from "../../components/FormInput/FormInput";

/**
 * PatchActivity
 */
export type PatchActivityProps = {
    loading?: boolean
    installed?: boolean
    activity?: Activity

    onSubmit?: (activity: Activity) => Promise<void>;
    onDelete?: () => Promise<void>
    onDownloadForm?: () => Promise<void>
}

/**
 * Activity
 */
export type Activity = {
    activityId?: string
    projectId?: string
    displayName?: string
    imageURL?: string
    description?: string
    tags?: string[]
    skills?: string[]
    priority?: Priority
    googleFormsURL?: string
    eta?: ETA
    startTime?: string
    hidden?: boolean
    installed?: boolean
}

/**
 * ETA
 */
export type ETA = "" | "15 min." | "30 min." | "1 hr." | "2 hr." | "4 hr."

/**
 * Priority
 */
export type Priority = "Normal" | "Above Normal" | "High"

/**
 * PatchActivity
 * @param props
 * @constructor
 */
export const PatchActivity = (props: PatchActivityProps) => {
    const [activity, setActivity] = React.useState(props.activity || {})
    const [saveWaiting, setSaveWaiting] = React.useState(false)
    const [confirmDelete, setConfirmDelete] = React.useState(false)
    const [deleteWaiting, setDeleteWaiting] = React.useState(false)
    const [downloadFormWaiting, setDownloadFormWaiting] = React.useState(false)

    const activityKey = JSON.stringify(props.activity)
    const submitDisabled = saveWaiting || downloadFormWaiting || deleteWaiting

    const set = (k: string, v: any) => setActivity(withKey(activity, k, v))
    const onDelete = () => setConfirmDelete(true)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setSaveWaiting(true)
        if(props.onSubmit){
            return props.onSubmit(changeSet(props.activity, activity))
                .then(() => setSaveWaiting(false))
        }
    }

    const onDeleteSubmit = async () => {
        setDeleteWaiting(true)
        if(props.onDelete){
            return props.onDelete().then(() => setDeleteWaiting(false))
        }
    }

    const onDownloadFormSubmit = async () => {
        setDownloadFormWaiting(true)
        if(props.onDownloadForm){
            return props.onDownloadForm().then(() => setDownloadFormWaiting(false))
        }
    }

    React.useEffect(() => setActivity(props.activity || {}), [activityKey])

    return <>
        { !!props.loading && <></>}

        {
            !props.loading &&
            <>
                { confirmDelete && <ConfirmDialog
                    title="Delete activity?"
                    description="This action is permanent and cannot be reversed."
                    action="Delete"
                    actionColor="bg-rose-500 hover:bg-rose-600"
                    onCancel={() => setConfirmDelete(false)}
                    onContinue={async () => {
                        setConfirmDelete(false)
                        await onDeleteSubmit()
                    }}
                />}

                <div className="text-zinc-600 h-full px-20 py-10">
                    <div className="flex gap-x-4">
                        <div className="flex shrink-0 bg-zinc-100 rounded-md p-2">
                            <img
                                className="h-16 w-16 object-cover rounded-full object-cover"
                                alt={props.activity?.displayName}
                                src={props.activity?.imageURL}
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div className="flex flex-col my-auto gap-y-1">
                            <p className="text-2xl font-bold">{props.activity?.displayName}</p>
                            <div className="flex gap-x-2 text-sm">
                                <span className="my-auto">Activity ID</span>
                                <span className="my-auto bg-zinc-50 p-1 rounded-sm">{props.activity?.activityId}</span>
                            </div>
                        </div>
                    </div>

                    <form className="mt-5 bg-white border border-zinc-200 p-5 grid grid-cols-1 gap-y-4 rounded-md m-auto text-zinc-600 min-w-[30rem]" onSubmit={onSubmit}>
                        { !props.installed && <>
                                <h1 className="text-md font-bold">Basic Settings</h1>
                                <div className="ml-auto w-full max-w-[40rem]">
                                    <FormInput
                                        required
                                        displayName="Name"
                                        description="The display name of the activity."
                                        textValue={activity.displayName}
                                        onTextChange={v => set("displayName", v)}
                                    />
                                </div>

                                <div className="ml-auto w-full max-w-[40rem]">
                                    <FormInput
                                        type="paragraph"
                                        displayName="Description"
                                        description="A free form description of the activity. Max character count is 150."
                                        placeholder="Describe the activity in 150 characters or less."
                                        maxLength={150}
                                        textValue={activity.description}
                                        onTextChange={v => set("description", v)}
                                    />
                                </div>

                                <hr className="my-2" />
                                <h1 className="text-md font-bold">Appearance</h1>
                                <div className="ml-auto w-full max-w-[40rem]">
                                    <FormInput
                                        type="image"
                                        displayName="Image URL"
                                        description="The URL of the image to display for the activity, if none is set the default image will be shown. Recommended size is at least 500x500 pixels."
                                        imageValue={activity.imageURL}
                                        onImageChange={v => set("imageURL", v)}
                                    />
                                </div>

                                <hr className="my-2" />
                                <h1 className="text-md font-bold">Pedagogy</h1>
                                <div className="ml-auto w-full max-w-[40rem]">
                                    <FormInput
                                        type="tags"
                                        displayName="Tags"
                                        description="Comma-separated list of tags describing the activity allowing the activity to be more easily found."
                                        tagsValue={activity.tags}
                                        onTagsChange={(tags) => set("tags", tags)}
                                    />
                                </div>
                                <div className="ml-auto w-full max-w-[40rem]">
                                    <FormInput
                                        type="tags"
                                        displayName="Skills"
                                        description="Comma-separated list of tags describing which skills a learner can expect to improve upon completing the activity."
                                        tagsValue={activity.skills}
                                        onTagsChange={(tags) => set("skills", tags)}
                                    />
                                </div>
                                <div className="ml-auto w-full max-w-[40rem]">
                                    <FormInput
                                        type="select"
                                        displayName="Priority"
                                        description="The importance of the activity within the curriculum. Useful for increasing visibility to learners. Allowed values are: Normal, Above Normal, and High."
                                        options={{
                                            "Normal": "",
                                            "Above Normal": "",
                                            "High": "",
                                        }}
                                        selectedOption={activity.priority}
                                        onSelectChange={v => set("priority", v)}
                                    />
                                </div>
                                <div className="ml-auto w-full max-w-[40rem]">
                                    <FormInput
                                        required
                                        displayName="Project ID"
                                        description="The ID of the project that the activity belongs to."
                                        textValue={activity.projectId}
                                        onTextChange={v => set("projectId", v)}
                                    />
                                </div>
                                <div className="ml-auto w-full max-w-[40rem]">
                                    <FormInput
                                        type="url"
                                        displayName="Google Forms URL"
                                        description="The URL of the Google Forms lesson to associate with the activity. It must be of the form: https://docs.google.com/forms/d/:formId/edit."
                                        urlValue={activity.googleFormsURL}
                                        onURLChange={v => set("googleFormsURL", v)}
                                    />
                                </div>
                                <div className="ml-auto w-full max-w-[40rem]">
                                    <FormInput
                                        type="select"
                                        displayName="Estimated Completion Time"
                                        description="The estimated amount of time required to complete the activity."
                                        options={{
                                            "Select estimate": null,
                                            "15 min.": "",
                                            "30 min.": "",
                                            "1 hr.": "",
                                            "2 hr.": "",
                                            "4 hr.": "",
                                        }}
                                        selectedOption={activity.eta}
                                        onSelectChange={v => set("eta", v)}
                                    />
                                </div>

                                <hr className="my-2" />
                                <h1 className="text-md font-bold">Schedule</h1>
                                <div className="ml-auto w-full max-w-[40rem]">
                                    <FormInput
                                        type="datetime"
                                        displayName="Start Time"
                                        description="Make this activity an in-person synchronous event by setting a start time."
                                        dateTimeValue={activity.startTime}
                                        onDateTimeChange={v => set("startTime", v)}
                                    />
                                </div>
                                <hr className="my-2" />
                            </>
                        }
                        <h1 className="text-md font-bold">Permissions</h1>
                        <div className="ml-auto w-full max-w-[40rem]">
                            <FormInput
                                type="toggle"
                                displayName={activity.hidden ? "Hidden" : "Visible"}
                                description="When visible, the activity will be shown workspace members."
                                toggleValue={!activity.hidden}
                                onToggleChange={v => set("hidden", !v)}
                            />
                        </div>

                        <div className="flex">
                            <button disabled={submitDisabled} type="submit" className="rounded-md ml-auto flex gap-x-1 w-30 text-white bg-indigo-500 hover:bg-indigo-600 px-6 py-1.5 disabled:bg-inherit disabled:border disabled:border-zinc-200 disabled:text-zinc-600 disabled:hover:bg-inherit">
                                {saveWaiting && <div className="w-4 h-4 my-auto stroke-zinc-400">
                                    <LoaderIcon />
                                </div>}
                                <span className="my-auto">Save changes</span>
                            </button>
                        </div>
                    </form>

                    {!props.installed && <div className="flex flex-col gap-y-3 mt-10 pb-10">
                        <h1 className="text-md font-bold">Other Operations</h1>
                        <div className="flex mt-2 p-6 rounded-md bg-zinc-100">
                            <div>
                                <p className="text-zinc-700">Download Learning Form</p>
                                <p className="text-sm">Re-download the Google Forms URL associated with the
                                    activity.</p>
                            </div>

                            <button
                                className="my-auto flex gap-x-1 ml-auto px-4 py-2 text-sm rounded-md text-white bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500 disabled:hover:bg-indigo-500"
                                disabled={submitDisabled}
                                onClick={onDownloadFormSubmit}>
                                {downloadFormWaiting && <div className="w-4 h-4 my-auto stroke-white">
                                    <LoaderIcon/>
                                </div>}
                                <span className="my-auto">Download</span>
                            </button>
                        </div>


                        <h1 className="text-md font-bold">Danger</h1>
                        <div className="flex mt-2 p-6 rounded-md bg-zinc-100">
                            <div>
                                <p className="text-zinc-700">Delete activity</p>
                                <p className="text-sm">This is permanent and learners will loose their work.</p>
                            </div>
                            <button
                                className="my-auto flex gap-x-1 ml-auto px-4 py-2 text-sm rounded-md text-white bg-rose-500 hover:bg-rose-600 disabled:bg-rose-500 disabled:hover:bg-rose-500"
                                disabled={submitDisabled}
                                onClick={onDelete}>
                                {deleteWaiting && <div className="w-4 h-4 my-auto stroke-white">
                                    <LoaderIcon/>
                                </div>}
                                <span className="my-auto">Delete</span>
                            </button>
                        </div>
                    </div>}
                </div>
            </>
        }
  </>
}