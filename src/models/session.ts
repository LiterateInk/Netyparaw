import type { Fetcher } from "@literate.ink/utilities";

export type Session = Readonly<{
    /**
     * Content of NYPSESSID cookie.
     */
    id: string
    /**
     * Base URL of the YPareo instance.
     */
    baseURL: string

    fetcher: Fetcher
}>;