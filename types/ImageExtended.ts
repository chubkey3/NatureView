import { Image, Tag } from "@prisma/client";

export interface ImageSchemaWithTags extends Image {
    tags: Tag[]
}

export interface ImageSchemaWithStringTags extends Image {
    tags?: string[]
  }