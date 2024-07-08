"use client"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { deleteProduct, toggleProductAvailability } from "../../_actions/products";
import { useRouter } from "next/navigation";



export function ActiveToggleDropdownItem({ id, isAvailableForPurchase }: { id: string, isAvailableForPurchase: boolean }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    return <DropdownMenuItem
        disabled={isPending}
        onClick={() => {
            startTransition(async () => {
                await toggleProductAvailability(id, !isAvailableForPurchase)
                router.refresh()
            })
        }}>
        {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
}
export function DeleteDropdown({ id, disable }: { id: string, disable: boolean }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    return <DropdownMenuItem
        disabled={ disable ||isPending }
        onClick={() => {
            startTransition(async () => {
                await deleteProduct(id)
                router.refresh( )
            })
        }}>
            Delete
    </DropdownMenuItem>
}