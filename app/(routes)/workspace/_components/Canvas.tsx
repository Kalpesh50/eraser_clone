"use client";
import React, { useEffect, useRef, useState } from "react";
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { FILE } from "../../dashboard/_components/DashboardTable";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2, ZoomIn, X } from "lucide-react";
import { deflate } from 'pako';

// Custom Modal Component
const ImageModal = ({ imageUrl, onClose }: { imageUrl: string; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg max-w-[90vw] max-h-[90vh] overflow-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <img 
          src={imageUrl} 
          alt="Enlarged Diagram"
          className="w-auto h-auto max-w-full max-h-[90vh]"
        />
      </div>
    </div>
  );
};

const Canvas = ({
  onSaveTrigger,
  fileId,
  fileData,
}: {
  onSaveTrigger: any;
  fileId: any;
  fileData: FILE;
}) => {
  const [whiteBoard, setWhiteBoard] = useState<any>();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI | null>(null);

  useEffect(() => {
    whiteBoard && saveWhiteboard();
  }, [onSaveTrigger]);

  const updateWhiteBoard = useMutation(api.files.updateWhiteboard);

  const saveWhiteboard = () => {
    updateWhiteBoard({
      _id: fileId,
      whiteboard: JSON.stringify(whiteBoard),
    })
      .then(() => {
        toast.success("Canvas saved");
      })
      .catch((e) => {
        toast.error("Error saving canvas");
      });
  };

  const convertMermaidToPng = async (mermaidScript: string) => {
    try {
      const data = new TextEncoder().encode(mermaidScript);
      const compressed = deflate(data);
      const base64 = btoa(String.fromCharCode.apply(null, compressed as any))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const url = `https://kroki.io/mermaid/png/${base64}`;
      console.log("Generated PNG URL:", url);
      return url;
    } catch (error) {
      console.error("Kroki conversion error:", error);
      throw error;
    }
  };

  const generateDiagram = async () => {
    if (!prompt) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-diagram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate diagram");

      const data = await response.json();
      console.log("Received Mermaid script:", data.mermaidScript);

      // Convert Mermaid to PNG using Kroki
      const pngUrl = await convertMermaidToPng(data.mermaidScript);
      setGeneratedImageUrl(pngUrl);
      toast.success("Diagram generated successfully!");
    } catch (error) {
      toast.error("Failed to generate diagram");
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
      setPrompt("");
    }
  };

  return (
    <div className="flex h-full">
      {/* Canvas Side */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <Input
            placeholder="Describe the diagram you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="max-w-xl text-black"
            onKeyDown={(e) => e.key === "Enter" && generateDiagram()}
          />
          <Button 
            onClick={generateDiagram}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </div>

        <div className="flex-1">
          <Excalidraw
            excalidrawAPI={(api) => {
              excalidrawAPIRef.current = api;
            }}
            theme="dark"
            initialData={{
              elements: fileData?.whiteboard ? JSON.parse(fileData.whiteboard) : [],
            }}
            UIOptions={{
              canvasActions: {
                export: false,
                loadScene: false,
                saveAsImage: false,
              },
            }}
            onChange={(excaliDrawElements) => {
              setWhiteBoard(excaliDrawElements);
            }}
          >
            <MainMenu>
              <MainMenu.DefaultItems.ClearCanvas />
              <MainMenu.DefaultItems.Help />
              <MainMenu.DefaultItems.ChangeCanvasBackground />
            </MainMenu>
            <WelcomeScreen>
              <WelcomeScreen.Hints.MenuHint />
              <WelcomeScreen.Hints.ToolbarHint />
              <WelcomeScreen.Hints.HelpHint />
            </WelcomeScreen>
          </Excalidraw>
        </div>
      </div>

      {/* Generated Diagram Side */}
      {generatedImageUrl && (
        <div className="w-1/3 border-l p-4 overflow-auto">
          <h3 className="text-lg font-semibold mb-4">Generated Diagram</h3>
          <div 
            className="relative group cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <img 
              src={generatedImageUrl} 
              alt="Generated Diagram"
              className="w-full h-auto rounded-lg transition-all duration-300 group-hover:opacity-90"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black/50 p-2 rounded-full">
                <ZoomIn className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && generatedImageUrl && (
        <ImageModal 
          imageUrl={generatedImageUrl} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default Canvas;
