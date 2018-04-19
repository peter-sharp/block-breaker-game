function Grid({sizeX, sizeY, blocks} = {}) {
    return {
      sizeX: sizeX || 5,
      sizeY: sizeY || 8,
      blocks: blocks || []
    }
  }

  Grid.getBlock = R.curry(function(grid, {x, y}) {
    let block = grid.blocks[Grid.getVectId(grid, {x, y})]
    block.pos = Vect(x, y)
    return block
  })

  Grid.getVectId = R.curry(function(grid, {x, y}) {
    return y * grid.sizeX + x
  })

  
  Grid.getBlockVect = function(grid, blockId) {
    return Vect(blockId % grid.sizeX, Math.floor(blockId / grid.sizeX))
  }
  
  Grid.addBlocks = R.curry(function (grid, blocks) {
    grid.blocks = grid.blocks.slice(0)
    grid.blocks = R.reduce(
      (blocks, block) => {
        blocks[Grid.getVectId(grid, block.pos)] = block
        return blocks
      },
      grid.blocks,
      blocks
    )
    return grid
  })
  
  Grid.getBlockById = R.curry((grid, blockId) => R.prop(blockId, grid.blocks))
  
  Grid.getLikeAjacentBlocks = R.curry((grid, blockId) => {
      let block = Grid.getBlockById(grid, blockId)
      return R.compose(
          R.filter(Block.sameColor(block)),
          R.map(Grid.getBlock(grid)),
          Grid.getAdjacentVects
      )(grid, blockId)
  });
  
 
  
  Grid.mapLikeBlocks = R.curry((fn, grid, blockId) => {
    
    function mapLikeBlocks(fn, grid, done, blockId) { 
      let block = Grid.getBlockById(grid, blockId)
      let getVectId = Grid.getVectId(grid)
      if(!block) return []
   
      let getLikeBlocks = R.compose(
        R.map(block => fn(block, block.pos)),
        Grid.getLikeAjacentBlocks(grid)
      )

      
      let likeBlocks = getLikeBlocks(blockId)
      
  
      return R.reduce((blocks, block) => {
        let vectId = getVectId(block.pos)
        debugger
        if(R.indexOf(vectId, done) > -1) return blocks
        done = [vectId, ...done]
        let moreBlocks = mapLikeBlocks(fn, grid, done, vectId)
        debugger
        return [... blocks, ...moreBlocks]
      }, likeBlocks, likeBlocks)
      
    }
    let block = Grid.getBlockById(grid, blockId)
    block = fn(block, block.pos)
    let blocks = mapLikeBlocks(fn, grid, [blockId],blockId)
    blocks.push(block)
  
    return Grid.addBlocks(grid, blocks)
  })
  
  Grid.breakAjacentBlocks = Grid.mapLikeBlocks(Block.setBroken)

Grid.getAdjacentVects = R.curry(function (grid, blockId) {
  let vect = Grid.getBlockVect(grid, blockId);
  let vects = R.map(fn => fn(vect), [
    Vect.up,
    Vect.down,
    Vect.left,
    Vect.right
  ])
  
  return vects.filter(Grid.isInsideBounds(grid))
})

Grid.isInsideBounds = R.curry(function (grid, vect) {
  let inBounds = true
  if(vect.x < 0) inBounds = false
  if(vect.y < 0) inBounds = false
  if(vect.x >= grid.sizeX) inBounds = false
  if(vect.y >= grid.sizeY) inBounds = false
  return inBounds
})

export default Grid