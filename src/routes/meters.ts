import { Elysia, t } from "elysia";
import { create, deleteAll, deleteMeter, findAll, findById, update } from "../controllers/meters"


const meters = new Elysia({ prefix: "/api/meter" })
    .get('/id/:id', async ({ params: { id }, set }) => {
        const meter = await findById(id)
        if (meter) {
            set.status = 200
            return {
                meter: {
                    ...meter,
                    serialNumber: meter.serialNumber.toString(),
                }
            }
        }
        else {
            set.status = 404
            return { error: "meter not found" }
        }
    },
        {
            params: t.Object({
                id: t.Numeric()
            }),
        }
    )

    .delete('/id/:id', async ({ params: { id }, set }) => {
        return {}
        const meter = await deleteMeter(id)
        if (meter) {
            set.status = 200
            return {
                meter: {
                    ...meter,
                    serialNumber: meter.serialNumber.toString(),
                }
            }
        }
        else {
            set.status = 404
            return { error: "meter not found" }
        }
    },
        {
            params: t.Object({
                id: t.Numeric()
            }),
        }
    )

    .patch('/id/:id', async ({ params: { id }, set, body }) => {
        return {}
        const meter = await update(body, id)
        if (meter) {
            set.status = 200
            return {
                meter: {
                    ...meter,
                    serialNumber: meter.serialNumber.toString(),
                }
            }
        }
        else {
            set.status = 400
            return { error: "couldn't update meter" }
        }
    },
        {
            body: t.Object({
                data: t.Any()
            }),
            params: t.Object({
                id: t.Numeric()
            }),
        })

    .get('/all', async ({ set }) => {
        const meters = await findAll()
        if (meters.length) {
            set.status = 200
            return {
                meters: meters.map((item: any) =>
                ({
                    ...item,
                    serialNumber: item.serialNumber.toString()
                })
                )
            }
        }
        else {
            set.status = 404
            return { error: "no meter found" }
        }
    })

    .delete('/all', async ({ set }) => {
        return {}
        const meters = await deleteAll()
        if (meters) {
            set.status = 200
            return { meters }
        }
        else {
            set.status = 404
            return { error: "no meter found" }
        }
    })

    .post('/create', async ({ body, set }) => {
        return {}
        const meter = await create(body)
        if (meter) {
            set.status = 201
            return {
                meter: {
                    ...meter,
                    serialNumber: meter.serialNumber.toString(),
                }
            }
        }
        else {
            set.status = 400
            return { error: "couldn't create meter" }
        }
    },
        {
            body: t.Object({
                serialNumber: t.Numeric(),
                meterType: t.String(),
                parameters: t.String(),
                clientId: t.Numeric(),
                providerId: t.Numeric(),
                unitPrice: t.Numeric()
            }),
        }
    )

export default meters;