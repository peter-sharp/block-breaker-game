import Grid from './grid.js'
import Block from './block.js'
import Vect from './vect.js'
import map from '/web_modules/ramda/es/map.js'
import filter from '/web_modules/ramda/es/filter.js'
import curry from '/web_modules/ramda/es/curry.js'
import fillWithRandomBlocks from './fillWithRandomBlocks.js'
import renderBlocks from './renderBlocks.js'

const BLOCK_SIZE = 30;
const $grid = document.querySelector('svg');


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
      
      let blocksToFall = Grid.getBlocksAboveBlocks(grid, likeBlocks);
      
      grid = Grid.addBlocks(grid, likeBlocks);
      
      renderFn(grid);
    }
  }

  renderFn(grid);
}

let colors = ['darkgreen', 'purple', 'blue']
startGame(fillWithRandomBlocks(Grid(), colors), renderBlocks($grid, BLOCK_SIZE))
