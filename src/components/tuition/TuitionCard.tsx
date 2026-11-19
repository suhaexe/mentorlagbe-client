import Link from "next/link";
import { Tuition } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export const TuitionCard = ({ tuition }: { tuition: Tuition }) => {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={tuition.bannerImage}
          alt={tuition.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute right-2 top-2 bg-black/70 hover:bg-black/90">
          {tuition.mode}
        </Badge>
      </div>
      <CardHeader className="flex-1">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
          <span>{tuition.subject}</span>
          <span>•</span>
          <span>{tuition.classLevel}</span>
        </div>
        <h3 className="line-clamp-2 text-lg font-bold leading-tight">{tuition.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">By {tuition.tutorName}</p>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-bold text-primary">৳{tuition.monthlyFee} <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
      </CardContent>
      <CardFooter>
        <Link href={`/tuitions/${tuition._id}`} className={buttonVariants({ className: "w-full" })}>
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
};