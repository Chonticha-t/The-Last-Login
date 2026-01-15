import { useEffect, useState } from 'react';

// Icons for prism puzzle
const PRISM_ICONS = {
  SOURCE: "⦿",
  RECEIVER: "◎",
  BLOCK: "█",
  TOXIN: "☣",
  UP: "△",
  DOWN: "▽",
  SPLIT_UP: "◬",
  SPLIT_DOWN: "⟆",
};

// Level Configuration
const PRISM_CASES = {
  NORTH: {
    id: 'NORTH',
    title: 'CASE 01: THE BURIED SIGNAL',
    element: 'EARTH (ดิน)',
    autopsy: [
      "สภาพศพ: ฝังดินลึก, สัญลักษณ์ ∇ มีขีด",
      "ภายใน: ดินอัดแน่นในปอด (Blockage)",
      "เป้าหมาย: เจาะดินลงไปหาตัวรับที่ก้นหลุม"
    ],
    gridSize: { r: 6, c: 6 },
    source: { r: 1, c: 0, dir: 'RIGHT' },
    receiver: { r: 5, c: 4, type: 'NORMAL' },
    obstacles: [
      { r: 2, c: 2, type: 'BLOCK' }, { r: 2, c: 3, type: 'BLOCK' }, { r: 2, c: 4, type: 'BLOCK' },
      { r: 3, c: 1, type: 'BLOCK' }, { r: 3, c: 2, type: 'BLOCK' }, { r: 3, c: 5, type: 'BLOCK' },
      { r: 4, c: 2, type: 'BLOCK' }, { r: 4, c: 3, type: 'BLOCK' }
    ],
    inventory: { split_down: 1 }
  },
  EAST: {
    id: 'EAST',
    title: 'CASE 02: TOXIC REFRACTION',
    element: 'WATER (น้ำ)',
    autopsy: [
      "สภาพศพ: ลอยคว่ำหน้า, สัญลักษณ์ ∇",
      "พิษวิทยา: พบสารพิษในเลือด (Require Purple)",
      "เป้าหมาย: ผ่านพิษแล้วหักเหแสงลงน้ำ"
    ],
    gridSize: { r: 6, c: 6 },
    source: { r: 2, c: 0, dir: 'RIGHT' },
    receiver: { r: 5, c: 5, type: 'REQUIRES_PURPLE' },
    obstacles: [
      { r: 2, c: 3, type: 'TOXIN' },
      { r: 4, c: 1, type: 'BLOCK' }, { r: 4, c: 2, type: 'BLOCK' }
    ],
    inventory: { down: 1 }
  },
  SOUTH: {
    id: 'SOUTH',
    title: 'CASE 03: THE HANGING PATH',
    element: 'WIND (ลม)',
    autopsy: [
      "สภาพศพ: แขวนคอสูง, สัญลักษณ์ △ มีขีด",
      "ข้อสังเกต: รอยเชือกเฉียงขึ้น (Tension)",
      "เป้าหมาย: ส่งสัญญาณขึ้นที่สูง"
    ],
    gridSize: { r: 8, c: 6 },
    source: { r: 7, c: 0, dir: 'RIGHT' },
    receiver: { r: 0, c: 4, type: 'NORMAL' },
    obstacles: [
      { r: 3, c: 2, type: 'BLOCK' }, { r: 4, c: 3, type: 'BLOCK' },
      { r: 1, c: 3, type: 'BLOCK' }
    ],
    inventory: { split_up: 1 }
  }
};

const PrismMechanics = ({ onUnlock }: { onUnlock: () => void }) => {
  const [currentCase, setCurrentCase] = useState(PRISM_CASES.NORTH);
  const [grid, setGrid] = useState<any[][]>([]);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [beams, setBeams] = useState<any[]>([]);
  const [status, setStatus] = useState("IDLE");
  const [logMessage, setLogMessage] = useState("READY FOR INPUT");

  useEffect(() => {
    resetLevel();
  }, [currentCase]);

  const resetLevel = () => {
    const { gridSize, obstacles, inventory: levelInv } = currentCase;
    
    let newGrid = Array(gridSize.r).fill(null).map(() => Array(gridSize.c).fill(null));
    
    obstacles.forEach((o: any) => {
      newGrid[o.r][o.c] = { type: o.type };
    });

    setGrid(newGrid);
    setInventory({ ...levelInv });
    setBeams([]);
    setStatus("IDLE");
    setSelectedTool(null);
    setLogMessage("SYSTEM RESET. AWAITING CONFIGURATION.");
  };

  const handleCellClick = (r: number, c: number) => {
    if (status === "ACTIVE" || status === "SUCCESS") return;
    
    if (selectedTool && !grid[r][c]) {
      if (inventory[selectedTool] > 0) {
        const newGrid = grid.map(row => [...row]);
        newGrid[r][c] = { type: 'PRISM', variant: selectedTool };
        setGrid(newGrid);
        setInventory(prev => ({ ...prev, [selectedTool]: prev[selectedTool] - 1 }));
        setLogMessage(`PLACED ${selectedTool.toUpperCase()} PRISM AT [${r},${c}]`);
        setSelectedTool(null);
      }
    } 
    else if (grid[r][c]?.type === 'PRISM') {
      const removedType = grid[r][c].variant;
      const newGrid = grid.map(row => [...row]);
      newGrid[r][c] = null;
      setGrid(newGrid);
      setInventory(prev => ({ ...prev, [removedType]: prev[removedType] + 1 }));
      setLogMessage(`REMOVED COMPONENT FROM [${r},${c}]`);
    }
  };

  const activateCircuit = () => {
    setStatus("ACTIVE");
    setLogMessage("POWERING UP LASER ARRAY...");
    
    const { source, receiver, gridSize } = currentCase;
    let activeBeams: any[] = [];
    let beamHistory: any[] = [];
    let success = false;
    let failReason = "";

    activeBeams.push({ r: source.r, c: source.c, dr: 0, dc: 1, color: 'GREEN' });

    for (let step = 0; step < 50; step++) {
      if (activeBeams.length === 0) break;

      let nextBeams: any[] = [];

      for (let beam of activeBeams) {
        beamHistory.push({ ...beam });

        const nextR = beam.r + beam.dr;
        const nextC = beam.c + beam.dc;

        if (nextR < 0 || nextR >= gridSize.r || nextC < 0 || nextC >= gridSize.c) {
           continue;
        }

        const cell = grid[nextR][nextC];
        let newBeamsFromHere: any[] = [];
        let hitBlock = false;

        if (nextR === receiver.r && nextC === receiver.c) {
          if (receiver.type === 'REQUIRES_PURPLE' && beam.color !== 'PURPLE') {
            failReason = "ERROR: TOXIN SIGNATURE MISSING";
          } else {
            success = true;
          }
          continue; 
        }

        if (cell) {
          if (cell.type === 'BLOCK') {
            hitBlock = true;
          } 
          else if (cell.type === 'TOXIN') {
            newBeamsFromHere.push({ r: nextR, c: nextC, dr: beam.dr, dc: beam.dc, color: 'PURPLE' });
          }
          else if (cell.type === 'PRISM') {
            const variant = cell.variant;
            
            if (variant === 'up') {
              if (beam.dc !== 0) newBeamsFromHere.push({ r: nextR, c: nextC, dr: -1, dc: 0, color: beam.color });
              else if (beam.dr === 1) newBeamsFromHere.push({ r: nextR, c: nextC, dr: 0, dc: 1, color: beam.color });
            }
            else if (variant === 'down') {
              if (beam.dc !== 0) newBeamsFromHere.push({ r: nextR, c: nextC, dr: 1, dc: 0, color: beam.color });
              else if (beam.dr === -1) newBeamsFromHere.push({ r: nextR, c: nextC, dr: 0, dc: 1, color: beam.color });
            }
            else if (variant === 'split_up') {
              newBeamsFromHere.push({ r: nextR, c: nextC, dr: beam.dr, dc: beam.dc, color: beam.color });
              if (beam.dc !== 0) newBeamsFromHere.push({ r: nextR, c: nextC, dr: -1, dc: 0, color: beam.color });
            }
            else if (variant === 'split_down') {
               newBeamsFromHere.push({ r: nextR, c: nextC, dr: beam.dr, dc: beam.dc, color: beam.color });
               if (beam.dc !== 0) newBeamsFromHere.push({ r: nextR, c: nextC, dr: 1, dc: 0, color: beam.color });
            }
          }
        } else {
          newBeamsFromHere.push({ r: nextR, c: nextC, dr: beam.dr, dc: beam.dc, color: beam.color });
        }

        if (!hitBlock) {
          nextBeams.push(...newBeamsFromHere);
        }
      }
      activeBeams = nextBeams;
    }

    setBeams(beamHistory);

    if (success) {
      setStatus("SUCCESS");
      setLogMessage("CIRCUIT COMPLETED. AUTHENTICATING...");
      setTimeout(onUnlock, 1500);
    } else {
      setStatus("FAIL");
      setLogMessage(failReason || "SIGNAL LOST. ADJUST PRISMS.");
    }
  };

  return (
    <div className="w-full h-full bg-black text-green-500 font-mono p-4 flex flex-col items-center justify-center select-none overflow-y-auto">
      
      {/* HEADER: CASE FILE SWITCHER */}
      <div className="w-full max-w-4xl flex gap-2 mb-4 overflow-x-auto pb-2">
        {Object.values(PRISM_CASES).map((c: any) => (
          <button
            key={c.id}
            onClick={() => setCurrentCase(c)}
            className={`px-4 py-2 border rounded text-xs whitespace-nowrap transition-all
              ${currentCase.id === c.id 
                ? 'bg-green-900 border-green-500 text-white' 
                : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-green-800'}`}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        
        {/* LEFT: AUTOPSY REPORT */}
        <div className="w-full md:w-1/3 bg-gray-900/50 border border-green-800 p-4 rounded-lg h-fit">
          <h3 className="text-xl font-bold text-white mb-2 border-b border-green-800 pb-2">
            AUTOPSY: {currentCase.element}
          </h3>
          <ul className="text-sm space-y-3 text-green-300/80">
            {currentCase.autopsy.map((line: string, i: number) => (
              <li key={i} className="flex gap-2">
                <span className="text-green-600">➤</span> {line}
              </li>
            ))}
          </ul>
          
          {/* LOG CONSOLE */}
          <div className="mt-6 p-2 bg-black border border-green-900 font-mono text-xs h-24 overflow-y-auto">
            <p className="text-gray-500">System Log:</p>
            <p className={status === "FAIL" ? "text-red-500" : "text-green-400"}>
              {">"} {logMessage}
            </p>
          </div>
        </div>

        {/* RIGHT: CIRCUIT BOARD */}
        <div className="w-full md:w-2/3 flex flex-col items-center">
          
          {/* GRID */}
          <div className="relative bg-black border-4 border-gray-800 p-2 rounded-xl shadow-[0_0_30px_rgba(0,255,0,0.1)]">
            <div 
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${currentCase.gridSize.c}, 50px)` }}
            >
              {grid.map((row: any, r: number) => (
                row.map((cell: any, c: number) => {
                  const isSource = r === currentCase.source.r && c === currentCase.source.c;
                  const isReceiver = r === currentCase.receiver.r && c === currentCase.receiver.c;
                  
                  const activeBeam = beams.find((b: any) => b.r === r && b.c === c);
                  
                  return (
                    <div 
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      className={`
                        w-[50px] h-[50px] border border-gray-900 flex items-center justify-center text-xl relative transition-all cursor-pointer
                        ${cell?.type === 'BLOCK' ? 'bg-amber-900/40 border-amber-800' : ''}
                        ${cell?.type === 'TOXIN' ? 'bg-purple-900/40 border-purple-800' : ''}
                        ${isSource ? 'bg-green-900/20' : ''}
                        ${isReceiver ? 'bg-blue-900/20' : ''}
                        ${activeBeam ? 'shadow-[inset_0_0_10px_rgba(0,255,0,0.2)]' : ''}
                      `}
                    >
                      {isSource && <span className="text-green-500 text-2xl animate-pulse">{PRISM_ICONS.SOURCE}</span>}
                      {isReceiver && <span className={`text-2xl ${status==='SUCCESS'?'text-white animate-bounce':(currentCase.receiver.type==='REQUIRES_PURPLE'?'text-purple-400':'text-blue-400')}`}>{PRISM_ICONS.RECEIVER}</span>}
                      {cell?.type === 'BLOCK' && <span className="text-amber-700 text-sm">▓</span>}
                      {cell?.type === 'TOXIN' && <span className="text-purple-500 animate-pulse">{PRISM_ICONS.TOXIN}</span>}
                      
                      {cell?.type === 'PRISM' && (
                        <div className="text-yellow-400 text-2xl font-bold drop-shadow-[0_0_5px_yellow]">
                          {cell.variant === 'up' && PRISM_ICONS.UP}
                          {cell.variant === 'down' && PRISM_ICONS.DOWN}
                          {cell.variant === 'split_up' && PRISM_ICONS.SPLIT_UP}
                          {cell.variant === 'split_down' && PRISM_ICONS.SPLIT_DOWN}
                        </div>
                      )}

                      {activeBeam && (
                        <div className={`absolute w-2 h-2 rounded-full z-10
                          ${activeBeam.color === 'PURPLE' ? 'bg-purple-400 shadow-[0_0_8px_purple]' : 'bg-green-400 shadow-[0_0_8px_green]'}
                        `}></div>
                      )}
                    </div>
                  );
                })
              ))}
            </div>
          </div>

          {/* INVENTORY TOOLBAR */}
          <div className="mt-6 flex gap-4 flex-wrap justify-center">
            <div className="flex gap-2 p-2 bg-gray-800 rounded-lg border border-gray-700">
              {Object.entries(inventory).map(([key, count]) => (
                <button
                  key={key}
                  disabled={count <= 0}
                  onClick={() => setSelectedTool(key)}
                  className={`
                    w-16 h-16 flex flex-col items-center justify-center rounded border-2 transition-all
                    ${selectedTool === key 
                      ? 'border-yellow-400 bg-yellow-900/20 text-yellow-400' 
                      : count > 0 
                        ? 'border-gray-600 bg-black text-gray-400 hover:border-gray-400'
                        : 'border-gray-800 bg-gray-900 text-gray-700 cursor-not-allowed'}
                  `}
                >
                  <span className="text-2xl">
                    {key === 'up' && PRISM_ICONS.UP}
                    {key === 'down' && PRISM_ICONS.DOWN}
                    {key === 'split_up' && PRISM_ICONS.SPLIT_UP}
                    {key === 'split_down' && PRISM_ICONS.SPLIT_DOWN}
                  </span>
                  <span className="text-[10px] mt-1">x{count}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={activateCircuit}
                disabled={status === "ACTIVE" || status === "SUCCESS"}
                className="h-full px-6 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 text-white font-bold rounded border border-green-500 shadow-[0_0_15px_rgba(0,255,0,0.3)]"
              >
                {status === "ACTIVE" ? "PROCESSING..." : "ACTIVATE"}
              </button>
              <button 
                onClick={resetLevel}
                className="px-6 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs border border-red-900 rounded"
              >
                RESET SYSTEM
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrismMechanics;
