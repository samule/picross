import React, { useState, useEffect } from 'react'

function SimplePicrossGame() {
  const [size] = useState(5); // 5x5 grid for simplicity
  const [grid, setGrid] = useState([]);
  
  // Add emoji patterns
  const emojiPatterns = {
    "❤️": [
      [1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 1, 1],
      [0, 0, 0, 1, 1],
    ],
    "🌟": [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ],
    "🌸": [
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
    ],
    "🐱": [
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ],
    "🎮": [
      [0, 1, 1, 1, 0],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
    ],
    "☕": [
      [0, 1, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
    ],
    "🌈": [
      [1, 1, 1, 1, 1],  // First row is all filled
      [0, 1, 1, 1, 0],  // Middle rows form the arch
      [0, 0, 1, 0, 0],  // Center point
      [0, 0, 0, 0, 0],  // Empty row
      [0, 0, 0, 0, 0],  // Empty row
    ],
    "🎵": [
      [0, 0, 1, 1, 0],
      [0, 0, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 0, 0],
      [1, 1, 1, 0, 0],
    ],
    "🚀": [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1],
      [0, 0, 1, 0, 0],
    ],
    "🌺": [
      [1, 0, 1, 0, 1],
      [0, 1, 1, 1, 0],
      [1, 1, 0, 1, 1],
      [0, 1, 1, 1, 0],
      [1, 0, 1, 0, 1],
    ],
  };

  const [selectedEmoji, setSelectedEmoji] = useState("❤️");
  const [solution, setSolution] = useState(emojiPatterns["❤️"]);
  
  // Change playerGrid to store numbers instead of booleans
  // 0 = empty (white), 1 = filled (black), 2 = marked (grey)
  const [playerGrid, setPlayerGrid] = useState([]);
  
  // Initialize the game
  useEffect(() => {
    // Initialize with 0 (empty/white) state
    const emptyGrid = Array(size).fill().map(() => Array(size).fill(0));
    setPlayerGrid(emptyGrid);
    
    // Calculate row and column hints
    const rowHints = solution.map(row => 
      row.reduce((acc, cell, i) => {
        if (cell === 1) {
          if (acc.length === 0 || row[i-1] === 0) acc.push(0);
          acc[acc.length-1]++;
        }
        return acc;
      }, [])
    );

    const colHints = Array(size).fill().map((_, col) => {
      return solution.reduce((acc, row, i) => {
        if (row[col] === 1) {
          if (acc.length === 0 || solution[i-1]?.[col] === 0) acc.push(0);
          acc[acc.length-1]++;
        }
        return acc;
      }, []);
    });

    setGrid({ rowHints, colHints });
  }, [size, solution]);

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
    setSolution(emojiPatterns[emoji]);
    // Reset player grid
    const emptyGrid = Array(size).fill().map(() => Array(size).fill(0));
    setPlayerGrid(emptyGrid);
  };

  // Updated handle cell click to cycle through three states
  const handleCellClick = (row, col) => {
    const newGrid = [...playerGrid];
    // Cycle through states: 0 (white) -> 1 (black) -> 2 (grey) -> 0 (white)
    newGrid[row][col] = (newGrid[row][col] + 1) % 3;
    setPlayerGrid(newGrid);
    
    // Check if the puzzle is solved - only check filled (1) cells against solution
    const isComplete = checkCompletion(newGrid);
    if (isComplete) {
      alert('Congratulations! You solved the puzzle!');
    }
  };

  // Updated completion check to only verify filled (1) cells against solution
  const checkCompletion = (currentGrid) => {
    return currentGrid.every((row, i) =>
      row.every((cell, j) => 
        (solution[i][j] === 1 && cell === 1) || // should be filled and is filled
        (solution[i][j] === 0 && cell !== 1)    // should be empty and is not filled
      )
    );
  };

  // Add function to reset puzzle
  const handleReset = () => {
    const emptyGrid = Array(size).fill().map(() => Array(size).fill(0));
    setPlayerGrid(emptyGrid);
  };

  // Add function to generate random puzzle
  const handleRandomPuzzle = () => {
    const emojis = Object.keys(emojiPatterns);
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setSelectedEmoji(randomEmoji);
    setSolution(emojiPatterns[randomEmoji]);
    const emptyGrid = Array(size).fill().map(() => Array(size).fill(0));
    setPlayerGrid(emptyGrid);
  };

  if (!grid.rowHints) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Santi's Picross Game</h1>
      
      {/* Emoji selector grid */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Select a Pattern:</h2>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {Object.keys(emojiPatterns).map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiSelect(emoji)}
              className={`text-2xl p-2 rounded hover:bg-gray-100
                ${selectedEmoji === emoji ? 'bg-gray-200 border-2 border-blue-500' : ''}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Add control buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-medium"
        >
          Reset Puzzle
        </button>
        <button
          onClick={handleRandomPuzzle}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium"
        >
          Random Puzzle
        </button>
      </div>

      {/* Column hints */}
      <div className="flex mb-2">
        <div className="w-12"></div> {/* Spacer for row hints */}
        {grid.colHints.map((hints, i) => (
          <div key={i} className="w-12 text-center">
            {hints.map((hint, j) => (
              <div key={j} className="text-sm">{hint}</div>
            ))}
          </div>
        ))}
      </div>

      {/* Game grid with row hints */}
      {playerGrid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {/* Row hints */}
          <div className="w-12 flex items-center justify-end pr-2">
            {grid.rowHints[rowIndex].map((hint, i) => (
              <span key={i} className="mr-1">{hint}</span>
            ))}
          </div>
          
          {/* Updated cell styling to handle three states */}
          {row.map((cell, colIndex) => (
            <button
              key={colIndex}
              className={`w-12 h-12 border border-gray-400 m-px
                ${cell === 1 ? 'bg-black' : 
                  cell === 2 ? 'bg-gray-400' : 
                  'bg-white hover:bg-gray-100'}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}

      <div className="mt-4 text-sm text-gray-600">
        Click once to fill (black), twice to mark (grey), three times to clear (white).
      </div>
    </div>
  );
}

export default SimplePicrossGame
