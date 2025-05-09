import StartupForm from "@/components/StartupForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session) redirect("/");

  return (
    <>
      <section className="w-full bg-lavender !min-h-[230px] flex justify-center items-center flex-col py-10 px-6">
        <h1 className="text-[32px] sm:text-[48px] leading-tight text-center font-semibold text-navy"> Describe the Services You&apos;re offering</h1>
      </section>

      <StartupForm />
    </>
  );
};

export default Page;