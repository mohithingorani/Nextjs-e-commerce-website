
import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import client from "@/db/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActiveToggleDropdownItem, DeleteDropdown } from "./_components/ProductAction";

export default function AdminProductsPage() {
    return <div >
        <div className="flex justify-between item">
            <div className="flex flex-col justify-center">
                <PageHeader>
                    Products
                </PageHeader>
            </div>
            <div className="flex flex-col justify-center">
                <Button asChild>
                    <Link href="/admin/products/new">Add Product</Link>
                </Button>
            </div>
        </div>
        <ProductsTable />
        <div className="text-muted-foreground">

        </div>
    </div>
}

async function ProductsTable() {
    const products = await client.product.findMany({
        select: {
            id: true,
            name: true,
            PriceInRuppees: true,
            isAvailableForPurchase: true,
            _count: {
                select: {
                    orders: true
                }
            }
        }
    })
    if(products.length===0){
        return <div className="text-slate-600 mt-4">
            no products found
        </div>
    }
    return <>
        <Table >
            <TableHeader>
                <TableRow>
                    <TableHead className="w-0">
                        <span className="sr-only">Available for Purchase</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead className="w-0">
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>
                            {product.isAvailableForPurchase
                                ? <>
                                    <span className="sr-only">Available</span>
                                    <CheckCircle2 />
                                </> :
                                <>
                                    <span className="sr-only">Unavailable</span>
                                    <XCircle className="stroke-destructive" />
                                </>}
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{`₹ ${product.PriceInRuppees}`}</TableCell>
                        <TableCell>{`${product._count.orders} orders`}</TableCell>
                        <TableCell>
                            <DropdownMenu >
                                <DropdownMenuTrigger>
                                    <MoreVertical />
                                    <span className="sr-only">
                                        Action</span >
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <a download href={`/admin/products/${product.id}/download`}>
                                            Download
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href={`/admin/products/${product.id}/edit`}>
                                            Edit
                                        </Link>
                                    </DropdownMenuItem>
                                    <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase} />
                                    <DropdownMenuSeparator />
                                    <DeleteDropdown id={product.id} disable={product._count.orders > 0} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </>
}
