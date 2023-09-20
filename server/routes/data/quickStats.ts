import express, { Request, Response } from 'express'
import { Bus } from '../../models/Bus'
import { Stop } from '../../models/Stop'
import { Driver } from '../../models/Driver'

const router = express.Router()

router.get('/api/data/quick-stats', async (req: Request, res: Response) => { 
    const totalStops = await Stop.countDocuments({})
    const totalBus = await Bus.countDocuments({})
    const drivers = await Driver.countDocuments({})

    res.status(200).send({
       totalStops, totalBus,drivers
    })
})

export {router as GetQuickStats}   