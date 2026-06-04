"use client";

import { useState } from "react";
import Button from "@/components/button";
import * as Card from "@/components/card";
import Variables from "@/components/variables";

export default function Demo() {
    const variants = ["primary", "secondary"] as const;
    const [variant, setVariant] = useState(0);

    const handleClick = () => {
        setVariant((v) => (v + 1) % variants.length);
    };

    return (
        <Variables>
            <Card.Root variant={variants[variant]}>
                <Card.Title>Tailwind Config Variants</Card.Title>
                <Card.Description>This is a demo of the plugin</Card.Description>
                <Button variant={variants[variant]} className="mt-3" onClick={handleClick}>
                    Click me
                </Button>
            </Card.Root>
        </Variables>
    );
}
