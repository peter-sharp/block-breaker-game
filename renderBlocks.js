
import curry from 'https://unpkg.com/ramda@0.25.0/es/curry.js'
import Grid from './grid.js'
import Block from './block.js'
import s from './svg.js'

let renderBlocks = curry(function($grid, blockSize, grid) {
  
  for(let x = 0; x < grid.sizeX; x += 1) {
    for(let y = 0; y < grid.sizeY; y += 1) {
      
      let block = Grid.getBlock(grid, {x, y})
      
      let width = blockSize + 0.5;
      let height = blockSize + 0.5;
      
      let fill = (block.state == 'broken') ? '#333' : (block && block.color) || '#333'
      let $square = s(
        'rect',
        {
          width,
          height,
          x: x * blockSize,
          y: y * blockSize,
          id: `block-${Grid.getVectId(grid, {x, y})}`,
          fill
        })
      
      $grid.appendChild($square)
    }
  }
})

export default renderBlocks