import { Image } from "@prisma/client";

export default interface GroupByDate {
    [key: string]: Image[]
}