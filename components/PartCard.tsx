import {Button} from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge";
import {Part} from "@/app/types/part";

export default function PartCard({part}: { part: Part }) {
    return (
        <Card className="w-full max-w-xs flex flex-col justify-between">
            <CardHeader>
                <CardDescription>{part.sku}</CardDescription>
                <CardTitle className="w-5/6">{part.name}</CardTitle>
                <CardAction>
                    <p>{part.quantity}</p>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Badge>{part.category_name}</Badge>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button variant="outline" className="w-full">
                    Add
                </Button>
            </CardFooter>
        </Card>
    )
}
