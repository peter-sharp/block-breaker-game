
import curry from '/web_modules/ramda/es/curry.js'
import Grid from './grid.js'
import Block from './block.js'
import s from './svg.js'

let renderBlocks = curry(function($grid,  grid) {
  const { blocks } = grid;
  let updatedSquares = [];
  for(let block of blocks) {
      
      const { x, y, state, color, id, width, height } = block;
     
      let $square = $grid.getElementById(`block-${id}`)
      if($square) {
        $square.setAttributeNS(null, 'x', x);
        $square.setAttributeNS(null, 'y', y);
        $square.className.baseVal = `block block--${state} ${color ? `block--${color}`: ''}`;
      } else {
        $square = s(
          'rect',
          {
            width: width + 0.5,
            height: height + 0.5,
            x,
            y,
            id: `block-${id}`,
            class: `block block--${state} ${color ? `block--${color}`: ''}`
        })
        $grid.appendChild($square);
      }
      updatedSquares.push($square);
  }

  for (const $square of $grid.children) {
    if(!updatedSquares.includes($square)) {
      $square.remove();
    }
  }
})

export default renderBlocks