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
    <li className="startup-card group bg-white rounded-xl shadow-md p-4 max-w-xs mx-auto hover:shadow-lg transition-all">
      
      <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
        <p>{formatDate(_createdAt)}</p>
        <div className="flex items-center gap-1">
          <EyeIcon className="w-4 h-4 text-purple-500" />
          <span>{views}</span>
        </div>
      </div>

      
      {image && (
        <Link href={`/startup/${_id}`}>
          <Image
            src={image}
            alt="Startup project"
            width={300}
            height={180}
            className="rounded-md object-cover w-full h-36"
          />
        </Link>
      )}

      
      <div className="mt-3">
        <Link href={`/startup/${_id}`}>
          <h3 className="text-lg font-semibold line-clamp-1 text-gray-800 hover:text-purple-600 transition">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
      </div>

      
      <div className="mt-4 flex justify-between items-center">
        <Link href={`/user/${author?._id}`}>
          <p className="text-sm font-medium text-gray-700">{author?.name || "Unknown"}</p>
        </Link>

        <Link href={`/?query=${category?.toLowerCase()}`}>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{category}</span>
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

export default StartupCard;
