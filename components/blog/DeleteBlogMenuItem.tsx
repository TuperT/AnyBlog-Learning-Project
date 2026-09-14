"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";

export function DeleteBlogMenuItem({ id }: { id: string }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        const res = await fetch("/api/blog/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

        if(!res.ok) {
            return toast.error("Fail to delete blog")
        }

        toast.success("Blog successfully deleted")
        return router.refresh()
    };


    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={
                <Button variant="destructive">
                    <Trash2 />
                    Delete Post
                </Button>
                } 
            />

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>

                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your blog post
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button onClick={() => {
                        handleDelete()
                        setIsDialogOpen(false)
                    }
                    } variant="destructive">
                        <Trash2 />
                        Delete
                    </Button>
                    <DialogClose render={<Button type="button">Close</Button>} />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}