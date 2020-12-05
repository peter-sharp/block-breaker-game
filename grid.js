import Block from './block.js'
import Vect from './vect.js'
import curry from '/web_modules/ramda/es/curry.js'
import map from '/web_modules/ramda/es/map.js'
import reduce from '/web_modules/ramda/es/reduce.js'
import compose from '/web_modules/ramda/es/compose.js'
import indexOf from '/web_modules/ramda/es/indexOf.js'
import differenceWith from '/web_modules/ramda/es/differenceWith.js'
import prop from '/web_modules/ramda/es/prop.js'
import filter from '/web_modules/ramda/es/filter.js'

const BLOCK_SIZE = 30;
/**
 * 
 * Holds blocks and provides methods to access them according to the meta-grid
 * @param {int} sizeX x dimension of the meta-grid
 * @param {int} sizeY y dimension of the meta-grid
 * @param {int} width/height of a block in the grid
 * @param {array} blocks in grid
 */
function Grid({sizeX = 8, sizeY = 8, blockSize = BLOCK_SIZE, blocks = []} = {}) {
  return {
    sizeX: sizeX || 5,
    sizeY: sizeY || 8,
    blockSize: blockSize || 30,
    blocks: blocks || []
  }
}

/**
 * @param {Grid} grid
 * @param {Object} grid coordinate vector
 */
Grid.getBlock = curry(function getBlock(grid, {x, y}) {
  return grid.blocks.find(({ pos }) => Math.floor(pos.x / grid.blockSize) == x && Math.floor(pos.y / grid.blockSize) == y)
})

// Grid.getVectId = curry(function(grid, {x, y}) {
//   return y * grid.sizeX + x
// })


Grid.getBlockVect = function getBlockVect(grid, { x, y }) {
  return Vect(Math.floor(x / grid.blockSize), Math.floor(y / grid.blockSize));
}

Grid.snap = function snap(grid, { x, y }) {
  const gridPos = Grid.getBlockVect(grid, { x, y });
  return Vect(gridPos.x * grid.blockSize, gridPos.y * grid.blockSize);
}

/**
* updates blocks in grid with given blocks 
* {Grid} grid
* {array} blocks
* 
*/
Grid.assignBlocks = curry(function (grid, newBlocks) {
  const untouched = differenceWith((x,y) => x.id === y.id, grid.blocks, newBlocks);
  grid.blocks = [...untouched, ...newBlocks];
  return grid;
})

// Grid.addBlock = curry(function (grid, block) {
//   grid.blocks = grid.blocks.slice(0)
 
//   grid.blocks[Grid.getVectId(grid, block.pos)] = block
  
//   return grid
// })

Grid.getBlockById = curry(function getBlockById(grid, blockId) {
  return grid.blocks.find(({ id }) => id == blockId)
});

Grid.hasBlockId = function(grid, blockId){
  return !!Grid.getBlockById(grid, blockId); 
}

Grid.getLikeAjacentBlocks = curry((grid, block) => {
    return compose(
        filter(Block.sameColor(block)),
        filter(x => x),
        map(Grid.getBlock(grid)),
        Grid.getAdjacentVects
    )(grid, block)
});



Grid.getLikeBlocks = curry((grid, block) => {
  let getLikeAjacentBlocks = Grid.getLikeAjacentBlocks(grid)
  
  function getLikeBlocks(done, block = null) { 
    if(!block) return [];

    let likeBlocks = getLikeAjacentBlocks(block)

    return reduce((blocks, block) => {
      if(indexOf(block.id, done) > -1) return blocks;
      done = [block.id, ...done];
      const neibourBlocks = getLikeBlocks(done, block);

      return [...blocks, ...neibourBlocks]
    }, likeBlocks, likeBlocks)

  }
  

  return [block, ...getLikeBlocks([block.id], block)]
})

// Grid.getLeftmostBlocks = curry(function getLeftmostBlocks() {}) //TODO

/**
 * gets the topmost blocks along the x axis of a given array of blocks
 */
Grid.getTopmostBlocks = curry(function getTopmostBlocks(grid, blocks) {
  
})

Grid.getBlocksAboveBlocks = curry(function getBlocksAboveBlocks(grid, blocks) {
  let blocksAbove = new Set();
  
  blocks.forEach(function findBlocksAbove(block) {
    blocksAbove = new Set(Array.from(blocksAbove).concat(grid.blocks.filter(function isAboveBlock(x) {
      const xCoord = Grid.getBlockVect(grid, x);
      const blockCoord = Grid.getBlockVect(grid, block);
      return xCoord.x == blockCoord.x && xCoord.y <= blockCoord.y;
    })));
  })

  return Array.from(blocksAbove);
});



Grid.map = function mapGrid(fn, grid) {
  grid.blocks = map(fn, grid.blocks);
  return grid;
}

Grid.getAdjacentVects = curry(function getAdjacentVects(grid, block) {
  let vect = Grid.getBlockVect(grid, block);
  let vects = map(fn => fn(vect), [
    Vect.up,
    Vect.down,
    Vect.left,
    Vect.right
  ])
  
  return vects.filter(Grid.isInsideBounds(grid))
})

Grid.isInsideBounds = curry(function (grid, vect) {
  let inBounds = true
  if(vect.x < 0) inBounds = false
  if(vect.y < 0) inBounds = false
  if(vect.x >= grid.sizeX) inBounds = false
  if(vect.y >= grid.sizeY) inBounds = false
  return inBounds
})

export default Grid