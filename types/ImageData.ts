import { ImageSchemaWithTags } from "./ImageExtended";

export default interface ImageData {
    [key: string]: ImageSchemaWithTags[]
}