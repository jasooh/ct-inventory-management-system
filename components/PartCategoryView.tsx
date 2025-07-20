// PartCategoryView.tsx
// This component renders the available categories.

'use client'

import {Skeleton} from "@/components/ui/skeleton";
import ErrorText from "@/components/ErrorText";
import {Button} from "@/components/ui/button";
import {usePartCategories} from "@/lib/hooks/usePartCategories";

export default function PartCategoryView() {
    // Component state
    const {categoryData, isLoading, error} = usePartCategories();

    return (
        isLoading ? <Skeleton className="w-full h-full" /> : (
            <article>
                {(error && categoryData != null) && <ErrorText text={error.message}/>}
                {categoryData ? (
                    <section className="flex flex-col">
                        {
                            categoryData.map((categoryType, index) => (
                                <Button variant="ghost" key={index}>{categoryType.category_name}</Button>
                            ))
                        }
                    </section>
                ) : (
                    <ErrorText text="Category could not be found."/>
                )}
            </article>
        )
    )
}