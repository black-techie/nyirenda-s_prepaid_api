import { Elysia, t } from "elysia";
import { create, deleteUser, findAll, findById, login, update } from "../controllers/users"


const users = new Elysia({ prefix: "/api/user" })
    .get('/id/:id', async ({ params: { id }, set }) => {
        const user = await findById(id)
        if (user) {
            set.status = 200
            user.meter.serialNumber = user.meter.serialNumber.toString();
            return { user }
        }
        else {
            set.status = 404
            return { error: "user not found" }
        }
    },
        {
            params: t.Object({
                id: t.Numeric()
            }),
        }
    )

    .get('/all', async ({ set }) => {
        const users = await findAll()
        if (users.length) {
            set.status = 200
            return { users }
        }
        else {
            set.status = 404
            return { error: "no user found" }
        }
    })

    .post('/create', async ({ body, set, cookie: { jwt_token }, jwt }: any) => {
        return {
            error: "warning, not accessible!"
        }
        const isValid = await jwt.verify(jwt_token)
        if (!isValid) {
            set.status = 401
            return 'Unauthorized'
        }
        const user = await create(body)
        if (user) {
            set.status = 201
            return { user }
        }
        else {
            set.status = 400
            return { error: "couldn't create user" }
        }
    },
        {
            body: t.Object({
                firstName: t.String(),
                lastName: t.String(),
                phone: t.String(),
                locationId: t.Numeric(),
                meterId: t.Numeric(),
                key: t.String()
            }),
        }
    )

    .post('/login', async ({ body, set, cookie, setCookie, jwt }: any) => {
        const user = await login(body)
        if (user.id) {
            set.status = 201
            setCookie('jwt_token', await jwt.sign({ name: "wilbroad" }), {
                httpOnly: true,
            });
            return { user }
        }
        else {
            set.status = 400
            return { error: "couldn't create user" }
        }
    },
        {
            body: t.Object({
                phone: t.String(),
                key: t.String()
            }),
        }
    )

    .patch('/update', async ({ body, set }) => {
        return {}
        const user = await update(body)
        if (user) {
            set.status = 200
            return { user }
        }
        else {
            set.status = 400
            return { error: "couldn't update user" }
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
        const user = await deleteUser(body.id)
        if (user) {
            set.status = 200
            return { user }
        }
        else {
            set.status = 400
            return { error: "couldn't delete user" }
        }
    },
        {
            body: t.Object({
                id: t.Number()
            })
        })

export default users;