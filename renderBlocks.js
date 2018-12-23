
import curry from 'https://unpkg.com/ramda@0.25.0/es/curry.js'
import Grid from './grid.js'
import Block from './block.js'

let renderBlocks = curry(function($grid, blockSize, grid) {
  
  for(let x = 0; x < grid.sizeX; x += 1) {
    for(let y = 0; y < grid.sizeY; y += 1) {
      let $square = document.createElementNS('http://www.w3.org/2000/svg','rect');
      let block = Grid.getBlock(grid, {x, y})
      $square.style.width = blockSize + 0.5;
      $square.style.height = blockSize + 0.5;
      
      if(block.state == 'broken'){
        $square.setAttributeNS(null, 'fill', '#333')
      } else {
        $square.setAttributeNS(null, 'fill', (block && block.color) || '#333')
      }
      
      $square.setAttributeNS(null, 'x', x * blockSize)
      $square.setAttributeNS(null, 'y', y * blockSize)
      $square.setAttributeNS(null, 'id', `block-${Grid.getVectId(grid, {x, y})}`)
      
      $grid.appendChild($square)
    }
  }
})

export default renderBlocks