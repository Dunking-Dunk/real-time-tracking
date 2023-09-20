import express, { Request, Response } from "express";
import { Tracker } from "../../models/Tracking";
import { Point } from '../../models/Point'
import { BadRequestError } from "../../errors/bad-request-error";

const router = express.Router();

router.put('/api/gps-tracking/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const query = req.query
    const lat = Number(query.lat)
    const lng = Number(query.lng)
    const speed = Number(query.speed)

    if (!lat && !lng && !speed) throw new BadRequestError('required lat, lng, speed parameters')

    const tracker = await Tracker.findOneAndUpdate({ gpsId: id }, {
        $set: {
            speed: speed,
            coords: [lng, lat]
        }
    }, { multi: true, upsert: false })

    const point = Point.build({
        location: {
            type: 'Point',
            coordinate: [lat, lng]
        },
        trackerId: tracker?.id
    })

    await point.save()


    res.sendStatus(200)

})

export { router as UpdateGpsTracker }
