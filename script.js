import Grid from './grid.js'
import Block from './block.js'
import Vect from './vect.js'
import map from '/web_modules/ramda/es/map.js'
import filter from '/web_modules/ramda/es/filter.js'
import curry from '/web_modules/ramda/es/curry.js'
import fillWithRandomBlocks from './fillWithRandomBlocks.js'
import renderBlocks from './renderBlocks.js'
import loop from './loop.js';

const $grid = document.querySelector('svg');

function startGame (initialGrid, renderFn) {
  let grid = initialGrid;
  $grid.addEventListener('click', breakBlocks)
  const gridWidth = grid.sizeX * grid.blockSize;
  const gridHeight = grid.sizeY * grid.blockSize;
  $grid.setAttributeNS(null, 'width', gridWidth);
  $grid.setAttributeNS(null, 'height', gridHeight);
  $grid.setAttributeNS(null, 'viewBox', `0 0 ${gridWidth} ${gridHeight}`);
  function breakBlocks(ev) {
    if(ev.target.matches('rect')) {
      let $block = ev.target;
      const block = Grid.getBlockById(grid, $block.id.replace('block-', ''));
      let likeBlocks = Grid.getLikeBlocks(grid, block);

      likeBlocks = map(Block.setBroken, likeBlocks);
      
      let blocksToFall = Grid.getBlocksAboveBlocks(grid, likeBlocks);
      blocksToFall = filter(x => x.state != 'broken', blocksToFall);
      blocksToFall = map(Block.setFalling, blocksToFall);

      grid = Grid.assignBlocks(grid, [...blocksToFall, ...likeBlocks]);
    
    }
  }

  loop(function gameLoop() {
    let updatedBlocks = [];
    for (const blockA of grid.blocks) {
      if(blockA.state == 'falling') {
        let oldPos = blockA.pos;
        blockA.pos = Vect.down(oldPos);

        for (const blockB of grid.blocks) {
          if(Grid.getBlockVect(grid, blockB).x != Grid.getBlockVect(grid,blockA).x ||
            blockB.id == blockA.id ||
            blockB.state != 'broken') continue;
          if(blockA.y + blockA.height >= blockB.y) {
            blockA.state = 'alive';
            blockA.pos =  oldPos;
          }
        }
        if(blockA.y + blockA.height >= grid.sizeY * grid.blockSize) {
          blockA.state = 'alive';
          blockA.pos = oldPos;
        }
      }

      updatedBlocks.push(Block(blockA));
    }
    grid.blocks = updatedBlocks;
    renderFn(grid);
  });
}

let colors = ['green', 'red', 'blue', 'yellow']
startGame(fillWithRandomBlocks(Grid(), colors), renderBlocks($grid));
