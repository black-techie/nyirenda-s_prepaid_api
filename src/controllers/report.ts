import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient();


async function adminPanel(): Promise<any> {
    const data: any = {
        admins_count: 0,
        clients_count: 0,
        providers_count: 0,
        locations_count: 0,
        meters_count: 0,
        users_count: 0,
        transactions: {
            count: 0,
            revenue: 0,
            water: 0
        }

    }

    const admins = await prisma.admin.count()
    const clients = await prisma.client.count()
    const providers = await prisma.provider.count()
    const locations = await prisma.location.count()
    const meters = await prisma.meter.count()
    const users = await prisma.user.count()
    const transactions = await prisma.transaction.findMany({
        include: {
            meter: true,
        }
    })



    if (admins) {
        data.admins_count = admins
    }
    if (clients) {
        data.clients_count = clients
    }
    if (providers) {
        data.providers_count = providers
    }
    if (locations) {
        data.locations_count = locations
    }
    if (meters) {
        data.meters_count = meters
    }
    if (users) {
        data.users_count = users
    }

    if (transactions) {
        transactions.map((trans) => {
            data.transactions.count += 1;
            data.transactions.revenue += trans.amount;
            data.transactions.water += trans.units
        })
    }
    let formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    data.transactions.revenue = formatter.format(data.transactions.revenue)

    return data;
}




export {
    adminPanel
}