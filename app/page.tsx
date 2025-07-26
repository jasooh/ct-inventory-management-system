// The homepage of the application.

'use client';

import PartGridView from "@/components/PartGridView";
import {Label} from "@/components/ui/label";
import {appConstants} from "@/lib/appConstants";
import PartCategoryView from "@/components/PartCategoryView";
import Image from "next/image";
import Searchbar from "@/components/Searchbar";
import LoginButton from "@/components/LoginButton";
import {EditSummaryView} from "@/components/EditSummaryView";

export default function Home() {
    return (
        <main className="w-full h-screen flex flex-row items-center justify-center gap-4 p-4">
            {/* Sidebar view */}
            <aside
                className="flex flex-col items-center gap-10 w-[300px] h-full p-5 bg-primary-foreground rounded-xl shadow-xl">
                <section className="w-full flex flex-col items-center gap-4">
                    {/* Logo */}
                    <Image src="/caution_tape_logo.png" alt="Caution Tape Logo" width={200} height={200} />
                    <div className="flex flex-col items-center gap-1">
                        <Label>Inventory Management System</Label>
                        {/* Build version text */}
                        <Label className="text-gray-500 italic">{appConstants.BUILD_VERSION}</Label>
                    </div>
                    <LoginButton />
                </section>
                {/* Cateogry selector */}
                <Searchbar />
                <section className="w-full overflow-y-auto">
                    <PartCategoryView />
                </section>
            </aside>

            {/* Inventory view */}
            <section
                className="w-3/4 h-full p-5 bg-primary-foreground rounded-xl shadow-xl flex flex-col justify-between gap-4">
                <PartGridView />
            </section>

            {/* Edit summary */}
            <EditSummaryView />
        </main>
    );
}
