
import React, { useRef, useState } from "react";
import { Box, Button, Group, Paper } from "@mantine/core";

interface SignaturePadProps {
  width?: number;
  height?: number;
  onSave?: (dataUrl: string) => void;
}

export const SignPad: React.FC<SignaturePadProps> = ({
  width = 400,
  height = 200,
  onSave,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPointerPosition(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPointerPosition(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (canvas && onSave) {
      const dataUrl = canvas.toDataURL("image/png");
      onSave(dataUrl);
    }
  };

  const getPointerPosition = (
    e: React.MouseEvent | React.TouchEvent
  ): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;
    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  return (
    <Paper shadow="xs" p="md" withBorder radius="md">
      <Box
        style={{
          border: "1px solid #ccc",
          borderRadius: 4,
          width,
          height,
          touchAction: "none",
          background: "#fff",
        }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ display: "block", width: "100%", height: "100%", cursor: "crosshair" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </Box>
      <Group mt="sm">
        <Button onClick={clear} color="red" variant="outline" disabled={!hasSignature}>
          Clear
        </Button>
        <Button onClick={save} color="green" variant="filled" disabled={!hasSignature}>
          Save
        </Button>
      </Group>
    </Paper>
  );
};
