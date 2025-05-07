/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { AUTHOR_BY_ID_QUERY } from "./sanity/lib/queries";
import { client } from "./sanity/lib/client";
import { writeClient } from "./sanity/lib/write-client";
import type { NextAuthConfig } from "next-auth";

type GitHubProfile = {
  id: string;
  login: string;
  bio?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({
      user,
      profile,
    }: {
      user: { name?: string | null; email?: string | null; image?: string | null };
      profile: GitHubProfile;
    }) {
      const { id, login, bio } = profile;
      const { name, email, image } = user;

      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_ID_QUERY, { id });

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id,
          name,
          username: login,
          email,
          image,
          bio: bio || "",
        });
      }

      return true;
    },

    async jwt({
      token,
      account,
      profile,
    }: {
      token: any;
      account?: any;
      profile?: GitHubProfile;
    }) {
      if (account && profile) {
        const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id: profile.id });

        token.id = user?._id;
      }

      return token;
    },

    async session({
      session,
      token,
    }: {
      session: any;
      token: any;
    }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});
