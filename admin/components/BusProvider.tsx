"use client"

import React, { useEffect } from "react"
import { useAppDispatch } from "@/store/store"
import { setBuses } from "@/store/busReducer"
import { setStops } from "@/store/stopReducer"
import { clientSocket } from '../api/socket'
import { setTrackers } from "@/store/trackerReducer"
import { setDrivers } from "@/store/driverReducer"
import { setAnnouncements } from "@/store/announcementReducer"

const BusProvider = ({ buses, children, stops, trackers, drivers, announcements }: {
    buses: Bus[],
    stops: Stop[],
    trackers: [],
    drivers: [],
    announcements: [],
    children: React.ReactNode
}) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const client = new clientSocket()
        return () => {
            client.disconnectConnection()
        }
    }, [])


    useEffect(() => {
        dispatch(setBuses(buses))
        dispatch(setStops(stops))
        dispatch(setTrackers(trackers))
        dispatch(setDrivers(drivers))
        dispatch(setAnnouncements(announcements))
    }, [buses, stops, trackers, drivers, announcements])


    return (<>
        {children}
    </>)
}

export default BusProvider