
export interface AnalysisElement {
    title: string,
    description: string,
    severity: string
}

export interface AnalysisResponse {
    overview: string,
    elements: AnalysisElement[]
}