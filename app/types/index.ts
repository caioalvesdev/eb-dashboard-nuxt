import * as z from "zod";

export type Schema<T> = z.output<T>;
