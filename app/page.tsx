// The homepage of the application.

import PartGridView from "@/components/PartGridView";
import {PageSelector} from "@/components/PageSelector";

export default function Home() {

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <main
                className="w-3/4 h-[95%] p-5 bg-primary-foreground rounded-xl shadow-xl flex flex-col justify-between gap-4">
                <PartGridView />
                <PageSelector />
            </main>
        </div>
    );
}
