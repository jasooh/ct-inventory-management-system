// The homepage of the application.

import PartGridView from "@/components/PartGridView";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {appConstants} from "@/lib/appConstants";
import PartCategoryView from "@/components/PartCategoryView";
import Image from "next/image";
import Searchbar from "@/components/Searchbar";

export default function Home() {
    return (
        <main className="w-full h-screen flex flex-row items-center justify-center gap-4 p-4">
            {/* Sidebar */}
            <section className="flex flex-col items-center gap-10 w-[300px] h-full p-5 bg-primary-foreground rounded-xl shadow-xl">
                <section className="w-full flex flex-col items-center gap-4">
                    <Image src="/caution_tape_logo.png" alt="Caution Tape Logo" width={200} height={200} />
                    <Label>Inventory Management System</Label>
                    <Button className="w-full">Login</Button>
                </section>
                <section className="flex w-full h-full flex-col">
                    <Searchbar />
                    <PartCategoryView />
                </section>
                <Label className="text-gray-500 italic">{appConstants.BUILD_VERSION}</Label>
            </section>

            {/* Inventory view */}
            <section
                className="w-3/4 h-full p-5 bg-primary-foreground rounded-xl shadow-xl flex flex-col justify-between gap-4">
                <PartGridView />
            </section>
        </main>
    );
}
