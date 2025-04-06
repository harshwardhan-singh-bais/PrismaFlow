"use client"

import type React from "react"
import { useState } from "react"
import { FileUp, Play, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

import { DiagramCanvas } from "./diagram-canvas"
import { DiagramSettings } from "./diagram-settings"
import { Navbar } from "./navbar"

const DEFAULT_SCHEMA = `model User {
  id    Int     @id @default(autoincrement())
  name  String
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}`

export default function PrismaFlow() {
  const [schema, setSchema] = useState(DEFAULT_SCHEMA)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [view, setView] = useState<"3d" | "2d">("2d") // Default to 2D as requested
  const [layout, setLayout] = useState<"flowchart" | "traditional">("flowchart")
  const [spacing, setSpacing] = useState(100)
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setSchema(event.target.result as string)
      }
    }
    reader.readAsText(file)
  }

  const handleGenerate = () => {
    setIsGenerating(true)

    // Simulate processing time
    setTimeout(() => {
      if (schema.trim() === "") {
        toast({
          title: "Error",
          description: "Invalid schema, check syntax",
          variant: "destructive",
        })
        setIsGenerating(false)
        return
      }

      setIsGenerated(true)
      setIsGenerating(false)
      toast({
        title: "Success",
        description: "Diagram generated!",
      })
    }, 1000)
  }

  const handleClear = () => {
    setSchema("")
    setIsGenerated(false)
  }

  const handleExport = (format: "png" | "svg") => {
    console.log(`Exporting as ${format}...`)
    toast({
      title: "Export",
      description: `Diagram exported as ${format.toUpperCase()}`,
    })
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar onExport={handleExport} />

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-full md:w-2/5 p-4 border-r border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Prisma Schema</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleClear} disabled={isGenerating}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={isGenerating}
              >
                <FileUp className="h-4 w-4 mr-1" />
                Upload
              </Button>
              <input id="file-upload" type="file" accept=".prisma" className="hidden" onChange={handleFileUpload} />
            </div>
          </div>

          <Textarea
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            placeholder="Paste your Prisma schema here or upload a .prisma file"
            className="h-[calc(100vh-13rem)] font-mono bg-[#1e1e1e] border-gray-700 resize-none"
            disabled={isGenerating}
          />

          <Button
            className="w-full mt-4 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:opacity-90 transition-opacity"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="flex items-center">
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Generating...
              </div>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Generate Diagram
              </>
            )}
          </Button>

          <DiagramSettings
            view={view}
            setView={setView}
            layout={layout}
            setLayout={setLayout}
            spacing={spacing}
            setSpacing={setSpacing}
          />
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-3/5 bg-[#121212] relative">
          <Tabs defaultValue="diagram" className="w-full">
            <TabsList className="w-full bg-[#1e1e1e] rounded-none border-b border-gray-800">
              <TabsTrigger value="diagram" className="flex-1">
                Diagram
              </TabsTrigger>
              <TabsTrigger value="code" className="flex-1">
                Generated Code
              </TabsTrigger>
            </TabsList>
            <TabsContent value="diagram" className="p-0 h-[calc(100vh-8rem)]">
              <DiagramCanvas schema={schema} isGenerated={isGenerated} view={view} layout={layout} spacing={spacing} />
            </TabsContent>
            <TabsContent value="code" className="p-4 h-[calc(100vh-8rem)] overflow-auto">
              <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
                {isGenerated ? `// Generated ER Diagram code\n${schema}` : "Generate a diagram first to see the code."}
              </pre>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}