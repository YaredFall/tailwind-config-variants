"use client";

import { useState } from "react";
import Button from "@/components/button";

export default function Demo() {
    const variants = ["primary", "secondary"] as const;
    const [variant, setVariant] = useState(0);

    const handleClick = () => {
        setVariant((v) => (v + 1) % variants.length);
    };

    return (
        <div className="flex gap-2">
            <Button variant={variants[variant]} onClick={handleClick}>
                Click me
            </Button>
        </div>
    );
}
