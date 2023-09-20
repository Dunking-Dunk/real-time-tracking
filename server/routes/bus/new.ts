import express, { Request, Response } from 'express'
import { body } from 'express-validator'

import { Bus } from '../../models/Bus'
import { Stop } from '../../models/Stop'
import { Tracker } from '../../models/Tracking'
import { ValidateRequest } from '../../middleware/validate-request'
import { requireAuth } from '../../middleware/require-auth'
import { io } from '../../app'
import { Driver } from '../../models/Driver'

const router = express.Router()

router.post('/api/bus', requireAuth,
    [
        body('busSet').not().isEmpty().withMessage('Bus Set is required'),
        body('busName').not().isEmpty().withMessage('Bus Name is required'),
        body('stops').isLength({ min: 1 }).withMessage('requires more than one stop').notEmpty().withMessage('Stops are required')
    ],
    ValidateRequest,
    async (req: Request, res: Response) => {
        const { busName, busNumber, busSet, stops, stops_distance_time, stops_polyline, seats, status, ac, origin, description } = req.body


        let bus = Bus.build({
            busName,
            busNumber,
            busSet,
            stops,
            stops_distance_time,
            stops_polyline,
            seats,
            status,
            ac,
            origin,
            description,
            tracker: req.body.tracker,
            driver: req.body.driver ? req.body.driver : null
        })

        await bus.stops.map(async (stop) => {
            let doc = await Stop.findById(stop)
            doc?.busId?.push(bus._id)
            await doc?.save()
        })

        const tracker = await Tracker.build({ bus: bus._id, onBusRoute: `${bus.busNumber} ${bus.busSet}`, onBusName: bus.busName, gpsId: req.body.gpsId })
        await tracker?.save()

        bus.set({ tracker: tracker.id })

        if (req.body.driver) {
            const driver = await Driver.findById(bus.driver)
            driver?.set({ busId: bus._id })
            await driver?.save()
        }

        await bus.save()

        bus = await bus.populate('stops')


        io.emit('newBusAdded', bus)

        res.status(201).json(bus)
    })

export { router as NewBusRoute } 