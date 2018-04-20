import {} from './grid.js'
import Grid from './grid.js'
import Block from './block.js'
import Vect from './vect.js'
const BLOCK_SIZE = 30;
const $grid = document.querySelector('svg');

  
  
  
  
function randomPick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

let randomColor = () => randomPick(['darkgreen', 'purple', 'blue']);  
  
function fillWithRandomBlocks(grid) {
  grid = Grid(grid)
  
  for(let x = 0; x < grid.sizeX; x += 1) {
    for(let y = 0; y < grid.sizeY; y += 1) {
      grid.blocks.push(Block({color: randomColor()}));
    }
  }
  return grid;
}

function renderBlocks($grid, blockSize, grid) {
  
  for(let x = 0; x < grid.sizeX; x += 1) {
    for(let y = 0; y < grid.sizeY; y += 1) {
      let $square = document.createElementNS('http://www.w3.org/2000/svg','rect');
      let block = Grid.getBlock(grid, {x, y})
      $square.style.width = blockSize + 0.5;
      $square.style.height = blockSize + 0.5;
      $square.setAttributeNS(null, 'fill', (block && block.color) || '#333')
      $square.setAttributeNS(null, 'x', x * blockSize)
      $square.setAttributeNS(null, 'y', y * blockSize)
      $square.setAttributeNS(null, 'id', `block-${Grid.getVectId(grid, {x, y})}`)
      
      $grid.appendChild($square)
    }
  }
}
  function getBlockId($block) {
    return parseInt($block.id.split('-')[1], 10)
  }
  
  
  function startGame () {
    let grid = fillWithRandomBlocks(Grid());
    $grid.addEventListener('click', breakBlocks)

    function breakBlocks(ev) {
      if(ev.target.matches('rect')) {
        let $block = ev.target;
        grid = Grid.breakAjacentBlocks(grid, getBlockId($block));
       
        
        renderBlocks($grid, BLOCK_SIZE, grid);
      }
    }
    
    renderBlocks($grid, BLOCK_SIZE, grid);
  }
  startGame()
