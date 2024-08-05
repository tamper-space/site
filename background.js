const COLORS = [
    "#569cd6",
    "#c586c0",
    "#9cdcfe",
    "#4ec9b0",
    "#f14c4c",
    "#dcdcaa",
    "#808080",
    "#9cdcfe",
    "#c6c6c6"
  ];

const TERMS = [
    // Registers

    // x86_64
    'EAX', 'EBX', 'ECX', 'EDX',
    'ESI', 'EDI', 'EBP', 'ESP',
    'AX', 'BX', 'CX', 'DX',
    'SI', 'DI', 'BP', 'SP',
    'AL', 'BL', 'CL', 'DL',
    'AH', 'BH', 'CH', 'DH',

    // ARM
    'R0', 'R1', 'R2', 'R3',
    'R4', 'R5', 'R6', 'R7',
    'R8', 'R9', 'R10', 'R11',
    'R12', 'R13', 'R14', 'R15',
    'SP', 'LR', 'PC',

    // MIPS
    '$zero', '$at', '$v0', '$v1',
    '$a0', '$a1', '$a2', '$a3',
    '$t0', '$t1', '$t2', '$t3',
    '$t4', '$t5', '$t6', '$t7',
    '$s0', '$s1', '$s2', '$s3',
    '$s4', '$s5', '$s6', '$s7',
    '$t8', '$t9',
    '$k0', '$k1',
    '$gp', '$sp', '$fp', '$ra',

    // RISC-V
    'x0', 'x1', 'x2', 'x3',
    'x4', 'x5', 'x6', 'x7',
    'x8', 'x9', 'x10', 'x11',
    'x12', 'x13', 'x14', 'x15',
    'x16', 'x17', 'x18', 'x19',
    'x20', 'x21', 'x22', 'x23',
    'x24', 'x25', 'x26', 'x27',
    'x28', 'x29', 'x30', 'x31',
    'zero', 'ra', 'sp', 'gp', 'tp',

    // Instructions
    "AAA",
    "AAD",
    "AAM",
    "AAS",
    "ADC",
    "ADD",
    "AND",
    "BOUND",
    "CALL",
    "CBW",
    "CLC",
    "CLD",
    "CLI",
    "CMC",
    "CMP",
    "CMPSB",
    "CMPSW",
    "CWD",
    "DAA",
    "DAS",
    "DEC",
    "DIV",
    "ENTER",
    "ESC",
    "HLT",
    "IDIV",
    "IMUL",
    "IN",
    "INC",
    "INT",
    "INTO",
    "IRET",
    "INSB",
    "INSW",
    "JCC",
    "JCXZ",
    "JMP",
    "LAHF",
    "LDS",
    "LEA",
    "LEAVE",
    "LES",
    "LOCK",
    "LODSB",
    "LODSW",
    "LOOP",
    "LOOPx",
    "MOV",
    "MOVSB",
    "MOVSW",
    "MUL",
    "NEG",
    "NOP",
    "NOT",
    "OR",
    "OUT",
    "OUTSB",
    "OUTSW",
    "POP",
    "POPA",
    "POPF",
    "PUSH",
    "PUSHF",
    "PUSHA",
    "RCL",
    "RCR",
    "REPxx",
    "RET",
    "RETN",
    "RETF",
    "ROL",
    "ROR",
    "SAHF",
    "SAL",
    "SAR",
    "SBB",
    "SCASB",
    "SCASW",
    "SHL",
    "SHR",
    "STC",
    "STD",
    "STI",
    "STOSB",
    "STOSW",
    "SUB",
    "TEST",
    "WAIT",
    "XCHG",
    "XLAT",
    "XOR"
]

const Z = 35;

const random = {
    uniform: (min, max) => Math.random() * (max - min) + min,
};
  
class Vec {
    constructor(...components) {
        this.components = components;
    }
  
    add(vec) {
        this.components = this.components.map((c, i) => c + vec.components[i]);
        return this;
    }
  
    sub(vec) {
        this.components = this.components.map((c, i) => c - vec.components[i]);
        return this;
    }
  
    div(vec) {
        this.components = this.components.map((c, i) => c / vec.components[i]);
        return this;
    }
  
    scale(scalar) {
        this.components = this.components.map((c) => c * scalar);
        return this;
    }
  
    multiply(vec) {
        this.components = this.components.map((c, i) => c * vec.components[i]);
        return this;
    }
  
    rotateXY(angle) {
        const x =
          this.components[0] * Math.cos(angle) -
          this.components[1] * Math.sin(angle);
        const y =
          this.components[0] * Math.sin(angle) +
          this.components[1] * Math.cos(angle);
        this.components[0] = x;
         this.components[1] = y;
    }
}
  
const CENTER = new Vec(window.innerWidth / 2, window.innerHeight / 2);
const STARS = 1500;
  
class Canvas {
    constructor(id) {
        this.canvas = document.createElement("canvas");
    
        this.canvas.id = id;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        }
  
    draw() {
        const space = new Space();
        const draw = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            space.run(this.ctx);
            requestAnimationFrame(draw);
        };
        draw();
    }
}
  
class Star {
    constructor() {
        this.size = 10;
        this.pos = this.getPosition();
        this.screenPos = new Vec(0, 0);
        this.vel = random.uniform(0.05, 0.25);
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.term = TERMS[Math.floor(Math.random() * TERMS.length)];
    }
  
    getPosition(scale = 35) {
        const angle = random.uniform(0, 2 * Math.PI);
        const radius =
          random.uniform(window.innerHeight / scale, window.innerHeight) * scale;
    
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
    
        return new Vec(x, y, Z);
    }
  
    update() {
        this.pos.components[2] -= this.vel;
        this.pos = this.pos.components[2] < 1 ? this.getPosition() : this.pos;
        this.screenPos = new Vec(this.pos.components[0], this.pos.components[1])
          .div(new Vec(this.pos.components[2], this.pos.components[2]))
          .add(CENTER);
    
        this.size = (Z - this.pos.components[2]) / (this.pos.components[2] * 0.2);
        this.pos.rotateXY(0.003);
    }
  
    draw(ctx) {
        ctx.fillStyle = this.color;

        ctx.font = "10px sans-serif";
        ctx.fillText(
            this.term,
            this.screenPos.components[0],
            this.screenPos.components[1],
        );
    
        ctx.fill();
    }
}
  
class Space {
    constructor() {
        this.stars = new Array(STARS).fill(null).map(() => new Star());
    }
  
    update() {
        this.stars.forEach((star) => star.update());
    }
  
    draw(ctx) {
        this.stars.forEach((star) => star.draw(ctx));
    }
  
    run(ctx) {
        this.update();
        this.stars.sort((a, b) => b.pos.components[2] - a.pos.components[2]);
        this.draw(ctx);
    }
}
  
const canvas = new Canvas("canvas");
canvas.draw();
  