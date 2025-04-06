"use client";

import dynamic from "next/dynamic";
const DiagramCanvasNoSSR = dynamic(() => import("./diagram-canvas") as any, {
    ssr: false,
  });
  

export default DiagramCanvasNoSSR;
