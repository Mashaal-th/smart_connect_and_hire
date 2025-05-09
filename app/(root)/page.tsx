import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  const session = await auth();
  console.log(session?.user);

  console.log("here", session?.id);

  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

  return (
    <>
     <section className="w-full bg-white py-16 px-4 md:px-10">
  <div className="rounded-3xl bg-purple-100/70 shadow-xl border border-purple-200 px-8 py-12 max-w-6xl mx-auto text-center">
    <h1 className="text-4xl sm:text-5xl font-bold text-purple-900 leading-tight">
      Smart <br />
      Connect & Hire
    </h1>

    <p className="text-lg mt-4 text-purple-700 max-w-2xl mx-auto font-medium">
      Connect Smarter, Hire Faster
    </p>

    <div className="mt-8 max-w-xl mx-auto">
      <SearchForm query={query} />
    </div>
  </div>
</section>

<section className="w-full bg-white py-12 px-4 md:px-10">
  <div className="rounded-3xl bg-purple-100/70 shadow-xl border border-purple-200 px-8 py-12 max-w-6xl mx-auto">
    <p className="text-2xl font-semibold text-purple-800 mb-6 text-center">
      {query ? `Search results for "${query}"` : "All Startups"}
    </p>

    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts?.length > 0 ? (
        posts.map((post: StartupTypeCard) => (
          <StartupCard key={post?._id} post={post} />
        ))
      ) : (
        <p className="text-purple-500 italic text-center">No startups found</p>
      )}
     </ul>
      </div>
      </section>
      <SanityLive />
    </>
  );
}