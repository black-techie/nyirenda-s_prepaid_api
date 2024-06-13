import { jwt } from '@elysiajs/jwt'
import { cookie } from '@elysiajs/cookie';
import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static'


import index from "./routes/index"
import users from "./routes/users";
import admins from "./routes/admins";
import meters from "./routes/meters";
import reports from "./routes/reports";
import clients from "./routes/clients";
import providers from "./routes/provider";
import locations from "./routes/locations";
import transactions from "./routes/transactions";
import { ElysiaLogging } from '@otherguy/elysia-logging';


const port = process.env.PORT || 80


const app = new Elysia()
  .use(ElysiaLogging())
  .use(cookie())
  .use(jwt({name: 'jwt',secret: process.env.JWT_SECRETS!,exp: "3h"}))
  .use(staticPlugin({ assets: 'public', prefix: '' }))
  .use(index)
  .use(meters)
  .use(admins)
  .use(clients)
  .use(reports)
  .use(transactions)
  .use(users)
  .use(locations)
  .use(providers)
  .listen(port)


console.log(`🚀🚀🚀 Server is up and running! Access it at http://${app.server?.hostname}:${port}`);