export const paths = {
  board: "/board",
  callback: "/auth/callback",
  comment: (id: string) => `/board/comment/${id}`,
  index: "/",
  login: "/api/login",
  post: (id: string) => `/board/post/${id}`,
  signIn: "/auth/signIn",
  signOut: "/auth/signOut",
  signUp: "/auth/signUp",
};
