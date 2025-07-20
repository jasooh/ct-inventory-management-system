// PartCategoryView.tsx
// This component renders the available categories.

'use client'

import {Skeleton} from "@/components/ui/skeleton";
import ErrorText from "@/components/ErrorText";
import {Button} from "@/components/ui/button";
import {usePartCategories} from "@/lib/hooks/usePartCategories";
import {useInventoryContext} from "@/context/InventoryContext";

export default function PartCategoryView() {
    // Component state
    const {categoryData, isLoading, error} = usePartCategories();
    const {selectedCategory, setSelectedCategory} = useInventoryContext();

    const handleClick = (category: string) => {
        setSelectedCategory(category);
        console.log(selectedCategory);
    }

    return (
        isLoading ? <Skeleton className="w-full h-full"/> : (
            <article>
                {(error && categoryData != null) && <ErrorText text={error.message}/>}
                {categoryData ? (
                    <section className="flex flex-col">
                        {
                            categoryData.map((categoryType, index) => (
                                <Button
                                    className={`${selectedCategory == categoryType.category_name &&
                                    "hover:bg-black hover:text-white bg-black text-white duration-100"}`} // TODO: Make this work with swappable themes
                                    variant="ghost"
                                    onClick={() => handleClick(categoryType.category_name)}
                                    key={index}
                                >
                                    {categoryType.category_name}
                                </Button>
                            ))
                        }
                        <Button
                            className={`${selectedCategory == "None" &&
                            "hover:bg-black hover:text-white bg-black text-white duration-100"}`} // TODO: Make this work with swappable themes
                            variant="ghost"
                            onClick={() => handleClick("None")}
                        >
                            None
                        </Button>
                    </section>
                ) : (
                    <ErrorText text="Category could not be found."/>
                )}
            </article>
        )
    )
}