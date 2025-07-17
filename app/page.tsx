// The homepage of the application.

import PartGridView from "@/components/PartGridView";

export default function Home() {
    return (
        <main className="w-full h-screen flex flex-row items-center justify-center gap-4 p-4">
            <section className="w-[300px] h-full p-5 bg-primary-foreground rounded-xl shadow-xl">

            </section>
            <section
                className="w-3/4 h-full p-5 bg-primary-foreground rounded-xl shadow-xl flex flex-col justify-between gap-4">
                <PartGridView />
            </section>
        </main>
    );
}
