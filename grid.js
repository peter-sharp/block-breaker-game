import Block from './block.js'
import Vect from './vect.js'
import curry from 'https://unpkg.com/ramda@0.25.0/es/curry.js'
import map from 'https://unpkg.com/ramda@0.25.0/es/map.js'
import reduce from 'https://unpkg.com/ramda@0.25.0/es/reduce.js'
import compose from 'https://unpkg.com/ramda@0.25.0/es/compose.js'
import indexOf from 'https://unpkg.com/ramda@0.25.0/es/indexOf.js'
import prop from 'https://unpkg.com/ramda@0.25.0/es/prop.js'
import filter from 'https://unpkg.com/ramda@0.25.0/es/filter.js'

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
  
  function getLikeBlocks(grid, done, blockId) { 
    let block = Grid.getBlockById(grid, blockId)
    let getVectId = Grid.getVectId(grid)
    if(!block) return []

    
    


    let likeBlocks = getLikeBlocks(blockId)


    return reduce((blocks, block) => {
      let vectId = getVectId(block.pos)

      if(indexOf(vectId, done) > -1) return blocks
      done = [vectId, ...done]
      let moreBlocks = getLikeBlocks(grid, done, vectId)

      return [... blocks, ...moreBlocks]
    }, likeBlocks, likeBlocks)

  }
  let block = Grid.getBlockById(grid, blockId)
  let blocks = getLikeBlocks(grid, [blockId],blockId)
  blocks.push(block)

  return blocks
})


Grid.mapBlocksDirection = curry(function mapBlocksDirection(fn, dirFn, grid, blockId){
  
  let block = Grid.getBlockById(blockId)
  let nextBlock = Grid.getBlock(grid, dirFn(block.pos))
  let nextBlockId = Grid.getVectId(grid, nextBlock.pos)
  if(!Grid.hasBlockId(nextBlockId)) return grid
  
  nextBlock = fn(Block(nextBlock), nextBlock.pos, grid)
  grid = Grid.addBlock(grid, nextBlock)
  grid = mapBlocksDirection(fn, dirFn, grid, nextBlockId)
  return grid
})

let gridMapper = curry((fn, grid, block, i) => Grid.addBlocks(fn(block, Grid.getBlockVect(grid, i), grid)))

Grid.map = curry((fn, grid) => map(gridMapper(fn, grid), grid.blocks))

Grid.breakAjacentBlocks = Grid.mapLikeBlocks(Block.setBroken)

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