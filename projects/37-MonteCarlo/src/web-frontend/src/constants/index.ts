import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const atomAudio = atomWithStorage('audio', true)
export const atomCreateTaskModal = atom(false)

export const GRAPHQL_ENDPOINT = 'https://squid.cybros.network/graphql'
