import {useApi}              from "@local-civics/js-client";
import {useEffect}         from "./react"
import React, {useState}   from "react";
import {Event, EventQuery} from "../models/event";


/**
 * A custom hook to get events
 */
export const useEvents = (courseName?: string, query?: EventQuery | null) => {
    const { api } = useApi();
    const [events, setEvents] = useState(null as Event[] | null)
    useEffect(() => {
        (async () => {
            if(!courseName){
                setEvents(null)
            } else if(query === null){
                setEvents([])
            } else {
                setEvents(await api("GET", `/curriculum/v0/courses/${courseName}/events`, query));
            }
        })();
    }, [courseName, query]);
    return events;
};

/**
 * A custom hook to get an event query
 */
export const useEventQuery: (from: object | null) => [EventQuery | null, (key: string, value: any) => void] = (from: object | null) => {
    const [query, setQuery] = React.useState(from as EventQuery | null)
    return [query, (key: string, value: any) => {
        const newQuery = {...query, [key]: value}
        const isNullQuery = !((newQuery.tags && newQuery.tags?.length > 0) || (newQuery.pathways && newQuery.pathways?.length > 0) || newQuery.title)
        if(isNullQuery){
            setQuery(null)
        } else {
            setQuery(newQuery)
        }
    }]
}

/**
 * A custom hook to get an event
 */
export const useEvent = (courseName?: string, eventName?: string, query?: EventQuery) => {
    const { api } = useApi();
    const [event, setEvent] = useState(null as Event | null)
    useEffect(() => {
        (async () => {
            if(!courseName || !eventName){
               setEvent(null)
            } else {
               setEvent(await api("GET", `/curriculum/v0/courses/${courseName}/events/${eventName}`, query));
            }
        })();
    }, [courseName, eventName, query]);
    return event;
};