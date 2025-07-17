// The homepage of the application.

import PartGridView from "@/components/PartGridView";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Skeleton} from "@/components/ui/skeleton";
import {appConstants} from "@/lib/appConstants";

export default function Home() {
    return (
        <main className="w-full h-screen flex flex-row items-center justify-center gap-4 p-4">
            {/* Sidebar */}
            <section className="flex flex-col items-center justify-between w-[300px] h-full p-5 bg-primary-foreground rounded-xl shadow-xl">
                <section className="w-full flex flex-col items-center gap-4">
                    <Skeleton className="w-[200px] h-[200px]" /> {/* TODO: Replace with image */}
                    <Label>Inventory System</Label>
                    <Button className="w-full">Login</Button>
                </section>
                <section className="flex w-full flex-col">
                    <Button>Category</Button>
                </section>
                <Label className="text-gray-500 italic">v.{appConstants.BUILD_VERSION}</Label>
            </section>

            {/* Inventory view */}
            <section
                className="w-3/4 h-full p-5 bg-primary-foreground rounded-xl shadow-xl flex flex-col justify-between gap-4">
                <PartGridView />
            </section>
        </main>
    );
}
