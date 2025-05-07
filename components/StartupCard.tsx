import React from "react";
import Image from 'next/image';
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { formatDate, cn } from '@/lib/utils'; 
import { Button } from "@/components/ui/button"; 
import { Skeleton } from "@/components/ui/skeleton"; 
//import { Author, Startup } from "@/sanity/type";
import { Any } from "next-sanity";

//export type StartupTypeCard = Omit<Startup, "author"> & { author?: Author };
// Define the correct type for the startup object
// export type StartupTypeCard = Omit<Startup, "author"> & { author?: Author };
export type StartupTypeCard = Any

const StartupCard = ({ post }: { post: StartupTypeCard }) => {
  const {
    _createdAt,
    views,
    author,
    title,
    category,
    _id,
    image,
    description,
  } = post;

  return (
    <li className="startup-card group">
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${author?._id}`}>
            <p className="text-16-medium line-clamp-1">{author?.name || 'Unknown Author'}</p>
          </Link>
          <Link href={`/startup/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        {author?.image && (
          <Link href={`/user/${author?._id}`}>
            <Image
              src={author.image}
              alt={author?.name || "Author image"}
              width={48}
              height={48}
              className="rounded-full"
            />
          </Link>
        )}
      </div>

      <Link href={`/startup/${_id}`}>
        <p className="startup-card_desc">{description}</p>
        <Image
          src={image}
          alt="Startup project image"
          width={600}
          height={400}
          className="startup-card_img"
        />
      </Link>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>
        <Button className="startup-card_btn" asChild>
          <Link href={`/startup/${_id}`}>
            Details
          </Link>
        </Button>
      </div>
    </li>
  );
};

export const StartupCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index: number) => (
      <li key={cn('skeleton', String(index))}>
        <Skeleton className="startup-card_skeleton" />
      </li>
    ))}
  </>
);

export default StartupCard;
