import { Button } from "@/components/ui/button"
import client from "@/db/db"
import { Product } from "@prisma/client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/ui/ProductCard"
async function getMostPopular(){
    const products = await client.product.findMany({
        where : {isAvailableForPurchase : true},
        orderBy : {
            orders : {
                _count : "desc"
            }
        },
        take : 6
    })
    return products
}

async function getNewestProducts(){
    const products = await client.product.findMany(
        {
            where : {
                isAvailableForPurchase : true
            },
            orderBy : {
                createdAt : "desc"
            }
        }
    )
    return products

}



export default function HomePage() {
    return <main className="space-y-12">
        
        <ProductGridSection title="MostPopular" productsFetcher = {getMostPopular}/>
        <ProductGridSection title="Newest" productsFetcher = {getNewestProducts}/>

    </main>
}
type ProductGridSectionProps = {
    productsFetcher : () => Promise<Product[]>
    title : string
}

async function ProductGridSection({productsFetcher, title}:  ProductGridSectionProps ){
    const products = await productsFetcher()
    return <div className="space-y-4">
        <div className="flex gap-4">
            <h2 className="text-3xl font-bold">{title}</h2>
            <Button variant="outline" asChild>
                <Link className="space-x-2" href="/products">
                <span>View All</span>
                <ArrowRight className="size-4"/>
                </Link>
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product)=>(
                <ProductCard key={product.id} productName={product.name} productDescription={product.description} price={product.PriceInRuppees} id={product.id} imagePath={product.imagePath} />
            ))}
        </div>

    </div>
}