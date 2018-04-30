import Grid from './grid.js'
import Block from './block.js'
import Vect from './vect.js'
import map from 'https://unpkg.com/ramda@0.25.0/es/map.js'
import curry from 'https://unpkg.com/ramda@0.25.0/es/curry.js'
const BLOCK_SIZE = 30;
const $grid = document.querySelector('svg');

  
  
  
  
function randomPick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

  
function fillWithRandomBlocks(grid, colors) {
  grid = Grid(grid)
  
  for(let x = 0; x < grid.sizeX; x += 1) {
    for(let y = 0; y < grid.sizeY; y += 1) {
      grid.blocks.push(Block({color: randomPick(colors)}));
    }
  }
  return grid;
}

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
});

function getBlockId($block) {
  return parseInt($block.id.split('-')[1], 10)
}



function startGame (grid, renderFn) {

  $grid.addEventListener('click', breakBlocks)

  function breakBlocks(ev) {
    if(ev.target.matches('rect')) {
      let $block = ev.target;
      let likeBlocks = Grid.getLikeBlocks(grid, getBlockId($block));

      likeBlocks = map(Block.setBroken, likeBlocks);
      
      let blocksToFall = map(Block.setBroken, likeBlocks);
      
      grid = Grid.addBlocks(grid, likeBlocks);
      debugger
      renderFn(grid);
    }
  }

  renderFn(grid);
}

let colors = ['darkgreen', 'purple', 'blue']
startGame(fillWithRandomBlocks(Grid(), colors), renderBlocks($grid, BLOCK_SIZE))
