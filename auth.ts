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
      
      console.log("[signIn] GitHub profile id:", id);

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
        console.log("[jwt] GitHub profile id:", profile.id);
        
        try {
          const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id: profile.id });
          console.log("[jwt] User from Sanity:", user);
          
          // Check if user exists and has an _id
          if (user && user._id) {
            token.id = user._id;
          } else {
            // Fallback to using the GitHub profile ID directly
            console.log("[jwt] No Sanity _id found, using GitHub profile id");
            token.id = profile.id;
          }
        } catch (error) {
          console.error("[jwt] Error fetching user from Sanity:", error);
          // Fallback to using the GitHub profile ID
          token.id = profile.id;
        }
        
        console.log("[jwt] Updated token:", token);
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
      console.log("[session] Token received:", token);
      console.log("[session] Session before:", session);
      
      // First check if token.id exists
      const userId = token.id || token.sub;
      
      // Add ID to both places for maximum compatibility
      if (session.user) {
        session.user.id = userId;
      }
      
      // Also set at the root level
      session.id = userId;
      
      console.log("[session] Session after:", session);
      return session;
    },
  },
});