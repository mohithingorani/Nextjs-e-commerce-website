import client from "@/db/db";
import { PageHeader, ProductForm } from "../../../_components/PageHeader";

export default async function EditProductsPage({ params: { id } }: { params: { id: string } }) {

    const product = await client.product.findUnique({
        where: {
            id: id
        }
    })
    return <>
        <PageHeader>Edit Product</PageHeader>
        <ProductForm product={product} />
    </>
}