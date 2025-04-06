"use client"
import { Settings } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface DiagramSettingsProps {
  view: "3d" | "2d"
  setView: (view: "3d" | "2d") => void
  layout: "flowchart" | "traditional"
  setLayout: (layout: "flowchart" | "traditional") => void
  spacing: number
  setSpacing: (spacing: number) => void
}

export function DiagramSettings({ view, setView, layout, setLayout, spacing, setSpacing }: DiagramSettingsProps) {
  return (
    <Accordion type="single" collapsible className="mt-4">
      <AccordionItem value="settings" className="border-gray-700">
        <AccordionTrigger className="py-2 text-sm">
          <div className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Diagram Settings
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="view-toggle" className="text-sm">
                3D View
              </Label>
              <Switch
                id="view-toggle"
                checked={view === "3d"}
                onCheckedChange={(checked) => setView(checked ? "3d" : "2d")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="layout-select" className="text-sm">
                Layout Style
              </Label>
              <Select value={layout} onValueChange={(value) => setLayout(value as "flowchart" | "traditional")}>
                <SelectTrigger id="layout-select" className="bg-[#1e1e1e] border-gray-700">
                  <SelectValue placeholder="Select layout style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flowchart">Flowchart (Excalidraw-like)</SelectItem>
                  <SelectItem value="traditional">Traditional ERD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="spacing-slider" className="text-sm">
                  Node Spacing
                </Label>
                <span className="text-xs text-gray-400">{spacing}</span>
              </div>
              <Slider
                id="spacing-slider"
                min={50}
                max={200}
                step={10}
                value={[spacing]}
                onValueChange={(value) => setSpacing(value[0])}
                className="py-2"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

