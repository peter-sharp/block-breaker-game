import Grid from './grid.js'
import Block from './block.js'
import randomPick from './randomPick.js'

export default function fillWithRandomBlocks(grid, colors) {
  grid = Grid(grid)
  
  for(let y = 0; y < grid.sizeY; y += 1) {
    for(let x = 0; x < grid.sizeX; x += 1) {
      grid.blocks.push(Block({
        color: randomPick(colors),
        pos: [x * grid.blockSize, y * grid.blockSize],
        width: grid.blockSize,
        height: grid.blockSize
      }));
    }
  }
  return grid;
}