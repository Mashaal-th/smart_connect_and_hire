import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { PLAYLIST_BY_SLUG_QUERY, STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url"; 
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View"; 
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";

const md = markdownit();
const builder = imageUrlBuilder(client);

export const experimental_ppr = true;

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  const [post, editorPosts] = await Promise.all([
    client.fetch(STARTUP_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-picks-new" }),
  ]);

  if (!post) return notFound();

  const parsedContent = md.render(post.pitch || "");
  const urlFor = (source: any) => builder.image(source).url();

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        {post.image && (
          <div className="max-w-4xl mx-auto">
            <Image
              src={post.image}
              alt="thumbnail"
              width={896} // match max-w-4xl
              height={0}
              className="w-full h-auto rounded-xl"
            />
          </div>
        )}

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              {post.author?.image && (
                <Image
                  src={post.author.image}
                  alt="avatar"
                  width={64}
                  height={64}
                  className="rounded-full drop-shadow-lg"
                />
              )}
              <div>
                <p className="text-20-medium">{post.author?.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author?.username}
                </p>
              </div>
            </Link>

            <p className="category-tag">{post.category}</p>
          </div>

          <div className="flex items-center justify-between mt-5">
            {/* Adding the price here */}
            {post.priceRange && (
              <div className="text-20-medium text-green-600">
                <span className="font-semibold">Price Range: </span>
                {post.priceRange}
              </div>
            )}
          </div>

          <h3 className="text-30-bold mt-10">About Service</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>

        <hr className="divider" />

        {editorPosts?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Editor Pick</p>
            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: StartupTypeCard, index: number) => (
                <StartupCard key={index} post={post} />
              ))}
            </ul>
          </div>
        )}

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default Page;
