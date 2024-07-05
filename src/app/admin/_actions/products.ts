"use server"
import client from "@/db/db"
import {z} from "zod"
import fs from "fs/promises"
import { notFound, redirect } from "next/navigation"

const fileSchema = z.instanceof(File, {message : "Required"})
const imageSchema = fileSchema.refine(file=> file.size===0 || file.type.startsWith("image/"))


const addSchema  = z.object({
    name : z.string().min(1),
    description : z.string().min(1),
    priceInInr : z.coerce.number().int().min(1),
    file : fileSchema.refine(file=>file.size>0,"Required"),
    image : imageSchema.refine(file=>file.size>0,"Required")
})

export async function addProduct(prevState : unknown,formData : FormData){
    const result  = addSchema.safeParse(Object.fromEntries(formData.entries()))
    if(!result.success){
        return result.error.formErrors.fieldErrors
    }
    const data = result.data

    await fs.mkdir("products",{recursive : true})
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

    await fs.mkdir("public/products",{recursive : true})
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(`public/${imagePath}`, Buffer.from(await data.image.arrayBuffer()))

    await client.product.create({
        data : {
            isAvailableForPurchase : false,
            name : data.name,
            description : data.description,
            PriceInRuppees : data.priceInInr,
            filePath ,
            imagePath 
        }
    })

    redirect("/admin/products")
}

export async function toggleProductAvailability(id : string, isAvailableForPurchase:boolean){
    await client.product.update({
        where : {
            id : id
        },
        data : {
            isAvailableForPurchase : isAvailableForPurchase
        }

    })
}
export async function deleteProduct(id : string){
    const product = await client.product.delete({
        where : {
            id
        }
    })
    if(product == null){
        return notFound()
    }
    await fs.unlink(product.filePath)
    await fs.unlink(`public${product.filePath}`)
}