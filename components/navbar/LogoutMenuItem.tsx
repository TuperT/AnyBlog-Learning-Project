"use client";

import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

export function LogoutMenuItem() {
    const handleDelete = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        window.location.href = "/"
    };

    return (
        <Button onClick={handleDelete} variant="destructive">
            <LogOut />
            Logout
        </Button>
    );
}