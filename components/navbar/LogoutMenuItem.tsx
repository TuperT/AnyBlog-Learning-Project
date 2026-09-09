"use client";

import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

export function LogoutMenuItem() {
    const handleLogout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        window.location.href = "/"
    };

    return (
        <Button variant="destructive" onClick={handleLogout}>
            <LogOut /> Logout
        </Button>
    );
}