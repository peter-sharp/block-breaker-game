import Grid from './grid'
import Vect from './vect'

export function updateBlocksToFall(grid, block) {
  grid = Grid(grid)
  
  Grid.getVectId(grid, block)
  
  return grid;
}