import mongoose from 'mongoose';
import { BusDoc } from './Bus';
import { PointDoc } from './Point';

interface TrackerAttrs {
    bus: BusDoc,
    coords?: PointDoc,
    speed?: number,
    gpsId: string,
    onBusRoute: string,
    onBusName: string,
}

interface TrackerDoc extends mongoose.Document {
    bus: BusDoc,
    coords?:  PointDoc,
    speed?: number,
    gpsId: string,
    onBusRoute: string,
    onBusName: string,
}

interface TrackerModel extends mongoose.Model<TrackerDoc> {
    build(attrs: TrackerAttrs): TrackerDoc
}

const trackingSchema = new mongoose.Schema({
    speed: {
        type: Number,
        default: 0
    },
    bus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus'
    },
    coords: {
        type: [Number],
        default: [0,0]
    },
    onBusRoute: {
        type: String,
    },
    onBusName: {
        type: String,
    },
    gpsId: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform(doc,ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
}
)

trackingSchema.statics.build = (attrs: TrackerAttrs) => {
    return new Tracker(attrs)
}

const Tracker = mongoose.model<TrackerDoc, TrackerModel>('Tracker', trackingSchema)

export {Tracker}