import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import client from "@/db/db";

export default async function AdminDashboard() {
    const [salesData, userData, productData] = await Promise.all([
        getSalesData(),
        getUsersData(),
        getProductData()
    ])

    return <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCard title="Sales" subtitle={`${salesData.numberOfSales} Orders`} body={`₹${salesData.amount.toString()}`} />
            <DashboardCard title="Customer" body={`₹${userData.averageValuePerPerson} Average Value`} subtitle={`${userData.userCount}`} />
            <DashboardCard title="Active Products" body={`${productData.activeProducts}`} subtitle={`${productData.inactiveProducts} Inactive Products`} />
        </div>
    </>
}

async function wait(duration:number){
    return new Promise(resolve=>setTimeout(resolve,duration))
}

async function getSalesData() {
    const data = await client.order.aggregate({
        _sum: { pricePaidInRuppees: true },
        _count: true
    })
    return {
        amount: (data._sum.pricePaidInRuppees || 0),
        numberOfSales: data._count
    }
}

async function getUsersData() {
    const [userCount, orderData] = await Promise.all([client.user.count(), client.order.aggregate({ _sum: { pricePaidInRuppees: true } })])

    return {
        userCount,
        averageValuePerPerson: userCount === 0 ? 0 : (orderData._sum.pricePaidInRuppees || 0) / userCount
    }
}

async function getProductData() {
    const [activeProducts, inactiveProducts] = await Promise.all(
        [
            client.product.count({ where: { isAvailableForPurchase: true } }),
            client.product.count({ where: { isAvailableForPurchase: false } })
        ])
    return {
        activeProducts,
        inactiveProducts
    }
}

interface DashboardCardProps {
    title: string;
    subtitle: string;
    body: string;
}

function DashboardCard({ title, body, subtitle }: DashboardCardProps) {
    return <>
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{body}</p>
            </CardContent>
        </Card>
    </>
}