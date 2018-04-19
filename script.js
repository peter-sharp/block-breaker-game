;(function(){
  const BLOCK_SIZE = 30;
  const $grid = document.querySelector('svg');

  function Vect(x, y) {
    let vect = {0:x || 0, 1:y || 0};
    Object.defineProperty(vect, 'x', {
      get: function() {return vect[0]; },
      set: function(val) { vect[0] = val; },
    });
    Object.defineProperty(vect, 'y', {
      get: function() {return vect[1]; },
      set: function(val) { vect[1] = val; },
    });
    return vect;
  }
  
  Vect.up = function({x, y}) {
    return Vect(x, y + 1);
  }
  
  Vect.down = function({x, y}) {
    return Vect(x, y - 1);
  }
  
  Vect.left = function({x, y}) {
    return Vect(x - 1, y);
  }
  
  Vect.right = function({x, y}) {
    return Vect(x + 1, y);
  }
  
  
  function Block({color, state, pos}) {
    return {color: color || "#333", state: 'alive', pos: pos || Vect()}
  }
  
  Block.sameColor = R.eqProps('color')
  
  Block.setBroken = block => {
    block = Block(block)
    block.state = 'broken'
    block.color = '#333'
    return block
  }
  
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
      $square.style.width = blockSize;
      $square.style.height = blockSize;
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
        debugger
        
        renderBlocks($grid, BLOCK_SIZE, grid);
      }
    }
    
    renderBlocks($grid, BLOCK_SIZE, grid);
  }
  startGame()
})();