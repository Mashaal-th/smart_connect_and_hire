import { auth } from "@/auth";
import { sanityFetch } from "@/sanity/lib/live";
import UserProfileForm from "@/components/UserProfileForm";

const USER_PROFILE_QUERY = `*[_type == "user" && _id == $id][0]`;

export default async function ProfilePage(){
    const session = await auth();

    if (!session || !session.user){
        return <p> Please login to view your profile</p>;
    }

    const userId = session.id;

    const { data: user } = await sanityFetch({
        query: USER_PROFILE_QUERY,
        params: {id: userId },
    });

    return (
        <section className="px-4 py-12 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6"> Your Profile</h1>
            <UserProfileForm initialData={user}/>
        </section>
    );
}