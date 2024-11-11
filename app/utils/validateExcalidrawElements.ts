export function validateExcalidrawElements(elements: any[]) {
  return elements.map(element => ({
    ...element,
    // Ensure required properties exist
    type: element.type || 'rectangle',
    x: Number(element.x) || 0,
    y: Number(element.y) || 0,
    width: Number(element.width) || 100,
    height: Number(element.height) || 100,
    angle: Number(element.angle) || 0,
    // Add default styling if missing
    strokeColor: element.strokeColor || '#000000',
    backgroundColor: element.backgroundColor || 'transparent',
    fillStyle: element.fillStyle || 'hachure',
    strokeWidth: Number(element.strokeWidth) || 1,
    strokeStyle: element.strokeStyle || 'solid',
    roughness: Number(element.roughness) || 1,
    opacity: Number(element.opacity) || 100,
  }));
} 