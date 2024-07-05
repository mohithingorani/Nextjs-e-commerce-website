import Link from "next/link";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import Image from "next/image";


type ProductCardProps = {
    productName : string;
    productDescription : string;
    price : number;
    id : string;
    imagePath : string
}


export function ProductCard({ productName, price, productDescription, id,imagePath }:ProductCardProps) {
    return <Card className="flex overflow-hidden flex-col">
        <div className="relative w-full h-auto aspect-auto">
            <Image src={imagePath} fill alt={productName}/>
        </div>
        <CardHeader>
            <CardTitle>{productName}</CardTitle>
            <CardDescription>{price}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            <p className="line-clamp-4">{productDescription}</p>
        </CardContent>
        <Button asChild>
            <Link href={`/products/${id}/purchase`}>Purchase</Link>
        </Button>
    </Card>
}  