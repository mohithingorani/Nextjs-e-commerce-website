"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { ReactNode, useState } from "react";
import { addProduct } from "../_actions/products";
import { useFormState } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";

export function PageHeader({ children }: { children: ReactNode }) {
    return <div className="text-4xl">
        {children}
    </div>
}

export function ProductForm({ product }: { product?: Product | null }) {
    const [error, action] = useFormState(addProduct, {})
    const [priceInInr, setPriceInInr] = useState<number | undefined>(product?.PriceInRuppees);
    return <form action={action} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" name="name" required defaultValue={product?.name || ""} />
            {error.name && <div className="text-destructive">{error.name}</div>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="priceInInr">Price</Label>
            <Input type="number" id="priceInInr" name="priceInInr" defaultValue={product?.PriceInRuppees || ""} required value={priceInInr} onChange={(e) => setPriceInInr(Number(e.target.value) || undefined)}></Input>
            {error.priceInInr && <div className="text-destructive">{error.priceInInr}</div>}
        </div>
        <div>
            {priceInInr ? `₹${priceInInr}` : `₹0`}
        </div>
        <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required defaultValue={product?.description || ""} />
            {error.description && <div className="text-destructive" >{error.description}</div>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input type="file" id="file" name="file" required={product == null}></Input>
            {product != null && (<div className="text-muted-foreground">{product.filePath}</div>)}
            {error.file && <div className="text-destructive">{error.file}</div>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input type="file" id="image" name="image" required={product == null} />
            {product != null && <Image src={`/${product.imagePath}`} height="400" width="400" alt="Product Image" />}
            {error.image && <div className="text-destructive">{error.image}</div>}

        </div>
        <Button type="submit">Save</Button>
    </form>
}