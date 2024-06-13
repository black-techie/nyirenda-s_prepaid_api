import { Elysia } from "elysia";
import { adminPanel } from "../controllers/report";



const reports = new Elysia({ prefix: "/api/report" })

    .get('/logs', () => 'hello world')
    .get('/logs/system', () => 'hello world')
    .get('/logs/system/:id', () => 'hello world')
    .get('/logs/client', () => 'hello world')
    .get('/logs/client/:id', () => 'hello world')
    .get('/logs/meter', () => 'hello world')
    .get('/logs/meter/:id', () => 'hello world')

    .get('/clients', () => 'hello world')
    .get('/client/:id', () => 'hello world')

    .get('/users', () => 'hello world')
    .get('/users/client/:id', () => 'hello world')
    .get('/user/:id', () => 'hello world!')

    .get('/meters', () => 'hello world')
    .get('/meters/client/:id', () => 'hello world')
    .get('/meter/:id', () => 'hello world')

    .get('/locations', () => 'hello world')
    .get('/locations/client/:id', () => 'hello world')
    .get('/locations/meter/:id', () => 'hello world')
    .get('/location/:id', () => 'hello world')

    .get('/transactions', () => 'hello world')
    .get('/transactions/client/:id', () => 'hello world')
    .get('/transactions/meter/:id', () => 'hello world')
    .get('/transaction/:id', () => 'hello world')

    .get('/revenue', () => 'hello world')
    .get('/revenue/client/:id', () => 'hello world')


    .get("/adminPanel", async ({ set }) => {
        const data = await adminPanel()
        if (data) {
            set.status = 200
            return {data}
        }
        else {
            set.status = 404
            return { error: "no data found" }
        }
    })


export default reports;