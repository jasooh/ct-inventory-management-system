import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  urls: {
    signUp: "/"
  },
  tokenStore: "nextjs-cookie",
});
