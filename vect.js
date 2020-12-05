function Vect(x = 0, y = 0) {
    if(!(this instanceof Vect)) return new Vect(x, y);
    if(x instanceof Vect || Array.isArray(x)) {
      // NOTE yx assignment order very important
      y = x[1];
      x = x[0];
    }
    this[0] = x;
    this[1] = y;
    this.length = 2;
    const that = this;
    Object.defineProperty(this, 'x', {
      get: function() {return that[0]; },
      set: function(val) { that[0] = val; },
    });
    Object.defineProperty(this, 'y', {
      get: function() {return that[1]; },
      set: function(val) { that[1] = val; },
    });
  }

  
  Vect.down = function({x, y}) {
    return Vect(x, y + 1);
  }
  
  Vect.up = function({x, y}) {
    return Vect(x, y - 1);
  }
  
  Vect.left = function({x, y}) {
    return Vect(x - 1, y);
  }
  
  Vect.right = function({x, y}) {
    return Vect(x + 1, y);
  }
  
  export default Vect