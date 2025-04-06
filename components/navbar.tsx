"use client"

import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NavbarProps {
  onExport: (format: "png" | "svg") => void
}

export function Navbar({ onExport }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 bg-[#1e1e1e] border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-transparent bg-clip-text">
          PrismaFlow
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport("png")}>Download as PNG</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("svg")}>Download as SVG</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="sm">
            GitHub
          </Button>
        </a>
      </div>
    </header>
  )
}

