import { NextAuth } from "~/server/auth/auth";

const nextAuth = NextAuth();
export const onGet = nextAuth.onGet;
export const onPost = nextAuth.onPost;
