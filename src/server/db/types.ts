import type {
  Comment as PrismaComment,
  Post as PrismaPost,
} from "@prisma/client";

type MapDateToString<PropType> = PropType extends Date ? string : PropType;

export type MapDateObject<T> = {
  [PropertyKey in keyof T]: MapDateToString<T[PropertyKey]>;
};

export type Comment = MapDateObject<PrismaComment>;
export type Post = MapDateObject<PrismaPost>;
