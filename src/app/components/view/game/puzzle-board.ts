// eslint-disable-next-line max-classes-per-file
interface WordExample {
  textExample: string;
}

interface Point {
  x: number;
  y: number;
}

interface Size {
  w: number;
  h: number;
}

interface ImagePart {
  x: number;
  y: number;
}

export class PuzzleItem {
  offset: Point | null;

  x: number;

  y: number;

  size: Size;

  left: boolean;

  right: boolean;

  imagePart: ImagePart;

  selected: boolean;

  active: boolean;

  scale: number;

  word: string;

  initialX: number;

  initialY: number;

  canvas: HTMLCanvasElement;

  image: HTMLImageElement;

  constructor(x: number, y: number, canvas: HTMLCanvasElement, params: PuzzleItemParams, image: HTMLImageElement) {
    this.offset = null;
    this.x = x;
    this.y = y;
    this.size = params.size;
    this.left = params.left;
    this.right = params.right;
    this.imagePart = params.imagePart;
    this.selected = false;
    this.active = false;
    this.scale = params.scale;
    this.word = params.word;
    this.initialX = x;
    this.initialY = y;
    this.canvas = canvas;
    this.image = image;
  }

  draw(context: CanvasRenderingContext2D): void {
    const pimplSize = 15;
    context.save();
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x + this.size.w, this.y);
    context.lineTo(this.x + this.size.w, this.y + this.size.h / 2 - this.size.h / 5);
    if (this.right) {
      const cp1 = {
        x: this.x + this.size.w + pimplSize,
        y: this.y + (this.size.h / 2 - this.size.h / 3),
      };
      const cp2 = {
        x: this.x + this.size.w + pimplSize,
        y: this.y + (this.size.h / 2 + this.size.h / 3),
      };
      const end = {
        x: this.x + this.size.w,
        y: this.y + (this.size.h / 2 + this.size.h / 5),
      };
      context.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    }
    context.lineTo(this.x + this.size.w, this.y + this.size.h);
    context.lineTo(this.x, this.y + this.size.h);
    if (this.left) {
      context.lineTo(this.x, this.y + this.size.h / 2 + this.size.h / 5);

      const cp1 = {
        x: this.x + pimplSize,
        y: this.y + (this.size.h / 2 + this.size.h / 3),
      };
      const cp2 = {
        x: this.x + pimplSize,
        y: this.y + (this.size.h / 2 - this.size.h / 3),
      };
      const end = {
        x: this.x,
        y: this.y + (this.size.h / 2 - this.size.h / 5),
      };
      context.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    }
    context.lineTo(this.x, this.y);
    context.stroke();
    context.clip();
    context.drawImage(
      this.image,
      (this.imagePart.x - (this.canvas.width - this.image.width * this.scale) / 2) / this.scale,
      this.imagePart.y / this.scale,
      (this.size.w + pimplSize) / this.scale,
      this.size.h / this.scale,
      this.x,
      this.y,
      this.size.w + pimplSize,
      this.size.h
    );

    // context.font = '24px';

    const wordWidth = context.measureText(this.word).width;
    const wordOffset = this.left
      ? this.x + (this.size.w - wordWidth) / 2 + pimplSize / 2
      : this.x + (this.size.w - wordWidth) / 2;
    context.fillText(this.word, wordOffset, this.y + this.size.h / 2);
    context.closePath();
    context.restore();
  }

  activate(): void {
    this.active = !this.active;
  }
}

interface PuzzleItemParams {
  size: Size;
  left: boolean;
  right: boolean;
  imagePart: ImagePart;
  scale: number;
  word: string;
}

export class PuzzleBoard {
  private readonly canvas: HTMLCanvasElement;

  private readonly ctx: CanvasRenderingContext2D;

  image: HTMLImageElement;

  scale: number;

  puzzle: PuzzleItem[];

  selectedElement: PuzzleItem | null;

  constructor(
    wordsExample: WordExample[],
    private width: number,
    private height: number
  ) {
    this.selectedElement = null;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    if (this.ctx === null) {
      throw new Error('Unable to get 2D rendering context.');
    }
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.lineWidth = 1;
    this.image = new Image();
    // this.image.src = './assets/276f23b84137a0b964b1.png';
    this.image.src = './assets/images/level1/abbati2.jpg';
    this.scale = 0; // 500 высота области отрисовки
    this.puzzle = [];

    this.image.addEventListener('load', () => {
      const horizontalScale = this.canvas.width / this.image.width;
      const verticalScale = 500 / this.image.height;
      this.scale = Math.max(horizontalScale, verticalScale);
      // this.scale = this.canvas.height / this.image.height;
      let startY = 0;

      wordsExample.forEach((line) => {
        const lineWords = line.textExample.split(/\s+/gm);
        const wordCount = lineWords.length;
        const lineSymbols = lineWords.join('').length + wordCount * 6;

        let startX = 0;
        const puzzleH = (this.image.height * this.scale) / 10;
        for (let i = 0; i < wordCount; i += 1) {
          const puzzleW = (this.canvas.width / lineSymbols) * (lineWords[i].length + 6);

          this.puzzle.push(
            new PuzzleItem(
              startX,
              startY,
              this.canvas,
              {
                size: { w: puzzleW, h: puzzleH },
                imagePart: { x: startX, y: startY },
                left: i !== 0,
                right: i < lineWords.length - 1,
                scale: this.scale,
                word: lineWords[i],
              },
              this.image
            )
          );

          startX += puzzleW;
        }
        startY += puzzleH;
      });

      // this.canvas.addEventListener('mousedown', (e) => {
      //   const mouse = this.getMouseCoords(e);
      //   // Находим элементы, которые находятся под указателем мыши
      //   const elementsUnderMouse = this.puzzle.filter((el) =>
      //     this.cursorInRect(mouse.x, mouse.y, el.x, el.y, el.size.w, el.size.h)
      //   );
      //
      //   // Если есть элементы под мышью, помечаем только последний из них
      //   if (elementsUnderMouse.length > 0) {
      //     const topElement = elementsUnderMouse.at(-1);
      //     if (topElement === undefined) throw new Error('Element under mouse is undefined');
      //     topElement.selected = true;
      //     topElement.offset = this.getOffsetCoords(mouse, topElement);
      //     this.selectedElement = topElement;
      //   } else {
      //     this.puzzle.forEach((el) => {
      //       const puzzleItem = el;
      //       puzzleItem.selected = false;
      //     });
      //   }
      // });
      //
      // this.canvas.addEventListener('mousemove', (e) => {
      //   const mouse = this.getMouseCoords(e);
      //
      //   const arr = this.puzzle.map((el) => this.cursorInRect(mouse.x, mouse.y, el.x, el.y, el.size.w, el.size.h));
      //   // !arr.every((el) => !el) ? canvas.classList.add('pointer') : canvas.classList.remove('pointer');
      //   if (!arr.every((el) => !el)) {
      //     this.canvas.classList.add('pointer');
      //   } else {
      //     this.canvas.classList.remove('pointer');
      //   }
      //
      //   this.puzzle.forEach((el) => {
      //     const puzzleItem = el;
      //     if (puzzleItem.selected) {
      //       if (puzzleItem.offset === null) throw new Error('puzzleItem.offset is null');
      //       puzzleItem.x = mouse.x - puzzleItem.offset.x;
      //       puzzleItem.y = mouse.y - puzzleItem.offset.y;
      //     }
      //
      //     if (this.cursorInRect(mouse.x, mouse.y, puzzleItem.x, puzzleItem.y, puzzleItem.size.w, puzzleItem.size.h)) {
      //       if (!puzzleItem.active) {
      //         puzzleItem.activate();
      //       }
      //     } else {
      //       puzzleItem.active = false;
      //     }
      //   });
      // });
      //
      // this.canvas.addEventListener('mouseup', () => {
      //   this.puzzle.forEach((e) => {
      //     if (e.selected) {
      //       this.animatePuzzleReturnToOriginalPosition(e, e.initialX, e.initialY);
      //       e.selected = false;
      //     }
      //   });
      // });

      this.setupCanvas();
      this.initListeners();
      this.animate();
    });
  }

  getCanvas() {
    return this.canvas;
  }

  initListeners(): void {
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', () => this.onMouseUp());
  }

  private setupCanvas(): void {
    this.canvas.style.backgroundColor = 'var(--transparent-bg)';
    // this.ctx.lineWidth = 1;
    // this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.font = '18px Stylish';
    this.ctx.fillStyle = 'white';
  }

  private onMouseDown(event: MouseEvent): void {
    const mouse = this.getMouseCoords(event);
    const elementsUnderMouse = this.puzzle.filter((el) =>
      this.cursorInRect(mouse.x, mouse.y, el.x, el.y, el.size.w, el.size.h)
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
  }

  private onMouseMove(event: MouseEvent): void {
    const mouse = this.getMouseCoords(event);

    const arr = this.puzzle.map((el) => this.cursorInRect(mouse.x, mouse.y, el.x, el.y, el.size.w, el.size.h));
    if (!arr.every((el) => !el)) {
      this.canvas.classList.add('pointer');
    } else {
      this.canvas.classList.remove('pointer');
    }

    this.puzzle.forEach((el) => {
      const puzzleItem = el;
      if (puzzleItem.selected) {
        if (puzzleItem.offset === null) throw new Error('puzzleItem.offset is null');
        puzzleItem.x = mouse.x - puzzleItem.offset.x;
        puzzleItem.y = mouse.y - puzzleItem.offset.y;
      }

      if (this.cursorInRect(mouse.x, mouse.y, puzzleItem.x, puzzleItem.y, puzzleItem.size.w, puzzleItem.size.h)) {
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

  animate(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.ctx.canvas.height);
    this.puzzle.forEach((e) => {
      if (e !== this.selectedElement) e.draw(this.ctx);
    });
    // Отрисовываем выбранный элемент поверх остальных
    if (this.selectedElement) {
      this.selectedElement.draw(this.ctx);
    }
    window.requestAnimationFrame(() => this.animate());
  }

  getMouseCoords(event: MouseEvent) {
    const canvasCoords = this.canvas.getBoundingClientRect();
    return {
      x: event.pageX - canvasCoords.left,
      y: event.pageY - canvasCoords.top,
    };
  }

  getOffsetCoords(mouse: Point, rect: PuzzleItem) {
    return {
      x: mouse.x - rect.x,
      y: mouse.y - rect.y,
    };
  }

  cursorInRect(mouseX: number, mouseY: number, rectX: number, rectY: number, rectW: number, rectH: number) {
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
}
