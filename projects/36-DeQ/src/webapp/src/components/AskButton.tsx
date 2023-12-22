"use client"
import { useRouter } from 'next/navigation'
import {
  Button
} from "@/components/material-tailwind";
export default function AskButton() {
  const router = useRouter()
  return (
    <Button size="lg" onClick={() => router.push('questions/create')}>Ask</Button>
  )
}