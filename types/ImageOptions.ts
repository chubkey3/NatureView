export interface ImageOptions {    
    author: "JASON" | "CHRISTINA",
    tags: string[],
    description: string
}

export interface ImageOptionsObject {
    [key: string] : {
        author: "JASON" | "CHRISTINA",
        tags: string[],
        description: string
    }
}