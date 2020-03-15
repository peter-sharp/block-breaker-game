import Vect from './vect.js'
import eqProps from '/web_modules/ramda/es/eqProps.js'

export function Block({color, state, pos} = {}) {
    return {color: color || "#333", state: 'alive', pos: pos || Vect()}
  }
  
  Block.sameColor = eqProps('color')
  
  Block.setBroken = block => {
    block = Block(block)
    block.state = 'broken'
    return block
  }
  
export default Block