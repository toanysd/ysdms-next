'use server'

export interface ProcessTag {
    id: string
    label: string
    display_text: string
    category: string
}

export async function getProcessTagsAction(): Promise<{ system: ProcessTag[], custom: ProcessTag[] }> {
    // Return empty list so client component falls back to static list.
    return { system: [], custom: [] }
}

export async function addCustomTagAction(label: string, displayText: string): Promise<ProcessTag> {
    // Return a dummy tag since there's no DB table to save custom tags anymore.
    return {
        id: Math.random().toString(),
        label,
        display_text: displayText,
        category: 'custom'
    }
}
