import Block from './block.js'
import Vect from './vect.js'
import curry from '/web_modules/ramda/es/curry.js'
import map from '/web_modules/ramda/es/map.js'
import reduce from '/web_modules/ramda/es/reduce.js'
import compose from '/web_modules/ramda/es/compose.js'
import indexOf from '/web_modules/ramda/es/indexOf.js'
import prop from '/web_modules/ramda/es/prop.js'
import filter from '/web_modules/ramda/es/filter.js'

function Grid({sizeX, sizeY, blocks} = {}) {
  return {
    sizeX: sizeX || 5,
    sizeY: sizeY || 8,
    blocks: blocks || []
  }
}

Grid.getBlock = curry(function(grid, {x, y}) {
  let block = grid.blocks[Grid.getVectId(grid, {x, y})]
  block.pos = Vect(x, y)
  return block
})

Grid.getVectId = curry(function(grid, {x, y}) {
  return y * grid.sizeX + x
})


Grid.getBlockVect = function(grid, blockId) {
  return Vect(blockId % grid.sizeX, Math.floor(blockId / grid.sizeX))
}

/**
* updates blocks in grid with given blocks 
* {Grid} grid
* {array} blocks
* 
*/
Grid.addBlocks = curry(function (grid, blocks) {
  grid.blocks = grid.blocks.slice(0)
  grid.blocks = reduce(
    (blocks, block) => {
      blocks[Grid.getVectId(grid, block.pos)] = block
      return blocks
    },
    grid.blocks,
    blocks
  )
  return grid
})

Grid.addBlock = curry(function (grid, block) {
  grid.blocks = grid.blocks.slice(0)
 
  grid.blocks[Grid.getVectId(grid, block.pos)] = block
  
  return grid
})

Grid.getBlockById = curry((grid, blockId) => prop(blockId, grid.blocks))

Grid.hasBlockId = function(grid, blockId){
  return blockId > -1 && blockId < grid.sizeX * grid.sizeY 
}

Grid.getLikeAjacentBlocks = curry((grid, blockId) => {
    let block = Grid.getBlockById(grid, blockId)
    return compose(
        filter(Block.sameColor(block)),
        map(Grid.getBlock(grid)),
        Grid.getAdjacentVects
    )(grid, blockId)
});



Grid.getLikeBlocks = curry((grid, blockId) => {
  let getLikeAjacentBlocks = Grid.getLikeAjacentBlocks(grid)
  let getBlockById = Grid.getBlockById(grid)
  let getVectId = Grid.getVectId(grid)
  
  function getLikeBlocks(done, blockId) { 
    let block = getBlockById(blockId)
    if(!block) return []

    let likeBlocks = getLikeAjacentBlocks(blockId)

    return reduce((blocks, block) => {
      let vectId = getVectId(block.pos)

      if(indexOf(vectId, done) > -1) return blocks
      done = [vectId, ...done]
      let moreBlocks = getLikeBlocks(done, vectId)

      return [...blocks, ...moreBlocks]
    }, likeBlocks, likeBlocks)

  }
  
  let block = getBlockById(blockId)
  


  return [block, ...getLikeBlocks([blockId], blockId)]
})

Grid.getLeftmostBlocks = curry(function getLeftmostBlocks() {}) //TODO

/**
 * gets the topmost blocks along the x axis of a given array of blocks
 */
Grid.getTopmostBlocks = curry(function getTopmostBlocks(grid, blocks) {
  
})

Grid.getBlocksAboveBlocks = curry(function getBlocksAboveBlocks(grid, blocks) {
  let blocksAbove = {};
  
  blocks.forEach(function findBlocksAbove(block) {
    
  })

  return blocksAbove
});

Grid.getBlocksDirection = curry(function getBlocksDirection(dirFn, grid, blockId){
  
  let block = Grid.getBlockById(grid, blockId)
  let nextBlock = Grid.getBlock(grid, dirFn(block.pos))
  let nextBlockId = Grid.getVectId(grid, nextBlock.pos)
  if(!Grid.hasBlockId(nextBlockId)) return [block]
  
  return [nextBlock, ...getBlocksDirection(dirFn, grid, nextBlockId)]
})

let gridMapper = curry((fn, grid, block, i) => Grid.addBlocks(fn(block, Grid.getBlockVect(grid, i), grid)))

Grid.getBlocksAbove = Grid.getBlocksDirection(function getAbove({ x, y }) {
  return { x, y: y - 1 }
})

Grid.map = curry((fn, grid) => map(gridMapper(fn, grid), grid.blocks))

Grid.getAdjacentVects = curry(function (grid, blockId) {
  let vect = Grid.getBlockVect(grid, blockId);
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