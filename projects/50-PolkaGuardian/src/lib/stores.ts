import { writable, type Writable } from "svelte/store";
import type { AnalysisResponse } from "./typing";


export const ID_SELECTED_ISSUE: Writable<number> = writable(0);

export const ANALYSIS_RESPONSE: Writable<AnalysisResponse | null> = writable(null);