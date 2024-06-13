import { Elysia, t } from "elysia";
import { create, deleteLocation, findAll, findById, update } from "../controllers/locations"



const locations = new Elysia({ prefix: "/api/location" })
.get('/id/:id', async ({ params: { id }, set }) => {
    const location = await findById(id)
    if (location) {
        set.status = 200
        return { location }
    }
    else {
        set.status = 404
        return { error: "location not found" }
    }
},
    {
        params: t.Object({
            id: t.Numeric()
        }),
    }
)

.get('/all', async ({ set }) => {
    const locations = await findAll()
    if (locations.length) {
        set.status = 200
        return { locations }
    }
    else {
        set.status = 404
        return { error: "no location found" }
    }
})

.post('/create', async ({ body, set }) => {
    return {
        error: "warning, not accessible!"
    }
    const location = await create(body)
    if (location) {
        set.status = 201
        return { location }
    }
    else {
        set.status = 400
        return { error: "couldn't create location" }
    }
},
    {
        body: t.Object({
            gpsCoordinates: t.String(),
            country: t.String(),
            region: t.String(),
            district: t.String(),
            ward: t.String(),
            street: t.String(),
            clientId: t.Numeric()
        }),
    }
)

.patch('/update', async ({ body, set }) => {
    return {}
    const location = await update(body)
    if (location) {
        set.status = 200
        return { location }
    }
    else {
        set.status = 400
        return { error: "couldn't update location" }
    }
},
    {
        body: t.Object({
            id: t.Number(),
            data: t.Any()
        })
    })

.delete('/delete', async ({ body, set }) => {
    return {}
    const location = await deleteLocation(body.id)
    if (location) {
        set.status = 200
        return { location }
    }
    else {
        set.status = 400
        return { error: "couldn't delete location" }
    }
},
    {
        body: t.Object({
            id: t.Number()
        })
    })

    export default locations;