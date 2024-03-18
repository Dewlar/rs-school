// eslint-disable-next-line max-classes-per-file

// eslint-disable-next-line max-classes-per-file
class PuzzleItem {
  offset: { x: number; y: number } | null;

  selected: boolean;

  active: boolean;

  initialX: number;

  initialY: number;

  constructor(
    public x: number,
    public y: number,
    public edge: number
  ) {
    this.offset = null;
    this.selected = false;
    this.active = false;
    this.initialX = x;
    this.initialY = y;
  }

  draw(context: CanvasRenderingContext2D): void {
    const cp1 = { x: this.x + 70, y: this.y + 20 };
    const cp2 = { x: this.x + 70, y: this.y + 50 };
    const end = { x: this.x + 50, y: this.y + 40 };

    context.save();
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x + 50, this.y);
    context.lineTo(this.x + 50, this.y + 30);
    context.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    context.lineTo(this.x + 50, this.y + 70);
    context.lineTo(this.x, this.y + 70);
    context.lineTo(this.x, this.y);
    context.closePath();
    context.stroke();
    context.restore();
  }

  activate(): void {
    this.active = !this.active;
  }
}

export default class CanvasPuzzle {
  private readonly canvas: HTMLCanvasElement;

  private readonly ctx: CanvasRenderingContext2D;

  private puzzle: PuzzleItem[];

  selectedElement: PuzzleItem | null;

  constructor(
    private width: number,
    private height: number
  ) {
    this.selectedElement = null;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.backgroundColor = 'gray';
    this.ctx = this.canvas.getContext('2d')!;
    if (!this.ctx) {
      throw new Error('Unable to get 2D rendering context.');
    }
    this.ctx.lineWidth = 2;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.font = '10px Arial';
    this.puzzle = [new PuzzleItem(0, 0, 70)];
    this.initListeners();
    this.animate();
  }

  private fillPuzzle() {}

  private initListeners(): void {
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', () => this.onMouseUp());
  }

  private onMouseDown(event: MouseEvent): void {
    const mouse = this.getMouseCoords(event);
    // Находим элементы, которые находятся под указателем мыши
    const elementsUnderMouse = this.puzzle.filter((el) =>
      this.cursorInRect(mouse.x, mouse.y, el.x, el.y, el.edge, el.edge)
    );
    // Если есть элементы под мышью, помечаем только последний из них
    if (elementsUnderMouse.length > 0) {
      const topElement = elementsUnderMouse.at(-1);
      if (topElement === undefined) throw new Error('Element under mouse is undefined');
      topElement.selected = true;
      topElement.offset = this.getOffsetCoords(mouse, topElement);
      this.selectedElement = topElement;
    } else {
      this.puzzle.forEach((el) => {
        const puzzleItem = el;
        puzzleItem.selected = false;
      });
    }
    // this.puzzle.forEach((el) => {
    //   const puzzleItem = el;
    //   if (this.cursorInRect(mouse.x, mouse.y, puzzleItem.x, puzzleItem.y, puzzleItem.edge, puzzleItem.edge)) {
    //     puzzleItem.selected = true;
    //     puzzleItem.offset = this.getOffsetCoords(mouse, puzzleItem);
    //   } else {
    //     puzzleItem.selected = false;
    //   }
    // });
  }

  private onMouseMove(event: MouseEvent): void {
    const mouse = this.getMouseCoords(event);
    const arr = this.puzzle.map((item) => this.cursorInRect(mouse.x, mouse.y, item.x, item.y, item.edge, item.edge));
    this.canvas.classList.toggle(
      'pointer',
      arr.some((el) => el)
    );
    this.puzzle.forEach((el) => {
      const puzzleItem = el;
      if (puzzleItem.selected) {
        if (puzzleItem.offset === null) throw new Error('Cannot move');
        puzzleItem.x = mouse.x - puzzleItem.offset.x;
        puzzleItem.y = mouse.y - puzzleItem.offset.y;
      }
      // puzzleItem.active = this.cursorInRect(
      //   mouse.x,
      //   mouse.y,
      //   puzzleItem.x,
      //   puzzleItem.y,
      //   puzzleItem.edge,
      //   puzzleItem.edge
      // );
      if (this.cursorInRect(mouse.x, mouse.y, puzzleItem.x, puzzleItem.y, puzzleItem.edge, puzzleItem.edge)) {
        if (!puzzleItem.active) puzzleItem.activate();
      } else {
        puzzleItem.active = false;
      }
    });
  }

  private onMouseUp(/* event: MouseEvent */): void {
    this.puzzle.forEach((e) => {
      if (e.selected) {
        this.animatePuzzleReturnToOriginalPosition(e, e.initialX, e.initialY);
        e.selected = false;
      }
    });
  }

  private getMouseCoords(event: MouseEvent): { x: number; y: number } {
    const canvasCoords = this.canvas.getBoundingClientRect();
    return {
      x: event.pageX - canvasCoords.left,
      y: event.pageY - canvasCoords.top,
    };
  }

  private getOffsetCoords(mouse: { x: number; y: number }, rect: { x: number; y: number }): { x: number; y: number } {
    return {
      x: mouse.x - rect.x,
      y: mouse.y - rect.y,
    };
  }

  // works
  private cursorInRect(
    mouseX: number,
    mouseY: number,
    rectX: number,
    rectY: number,
    rectW: number,
    rectH: number
  ): boolean {
    const xLine = mouseX > rectX && mouseX < rectX + rectW;
    const yLine = mouseY > rectY && mouseY < rectY + rectH;

    return xLine && yLine;
  }

  animatePuzzleReturnToOriginalPosition(item: PuzzleItem, initialX: number, initialY: number) {
    const element = item;
    const distance = Math.sqrt((element.x - initialX) ** 2 + (element.y - initialY) ** 2);
    const animationDuration = 300 * (distance / this.canvas.width);
    const fps = 1000 / 60;

    const dx = (initialX - element.x) / (animationDuration / fps);
    const dy = (initialY - element.y) / (animationDuration / fps);

    let frameCount = 0;
    const animation = setInterval(() => {
      if (frameCount >= animationDuration) {
        clearInterval(animation);
        element.x = initialX;
        element.y = initialY;
      } else {
        element.x += dx;
        element.y += dy;
        frameCount += fps;
      }
    }, fps);
  }

  private animate(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.puzzle.forEach((item) => item.draw(this.ctx));
    window.requestAnimationFrame(() => this.animate());
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }
}
