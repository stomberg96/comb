/*
Class for Comb hex cells
meant to function as the basic button class, particularly for the main chord grid.

HOW MOUSEOVER DETECTION WORKS:
this class detects mouseovers with a "map" color on each shape, which is displayed before the
user viewable display color. This color is checked against the color under the mouse when the 
mouse is pressed (mouseIsPressed boolean check). Each Clickable shape displays with a different map color
that serves as an identifier.

CAN:
-display basic shape with fill color
-detect mouseIsPressed over individual Cells, and respond accordingly. Changes color.
-keep track of how many cells there are, and each cell is numbered in draw order

CAN'T:
-model components are mostly unimplemented
-play chords yet

DEPENDS ON:
p5.js
*/


//view: responsible for displayable tasks ie drawing to the canvas
//displayable tasks include user-viewable and non-user-viewable (mouseover map display)
class CellView extends Displayable{
  constructor(x,y,r,displayColor,mapCol){
    super();
    this.x = x;//coords
    this.y = y;
    this.r = r;//radius
    this.cellText = '';//text to display in a cell
    this.mapColor = mapCol;//this is the hit map color to detect mouseover events
    this.displayColor = displayColor;//this is the color that the user sees. 
    this.SIDES = 6;
  }
  
  //https://p5js.org/examples/form-regular-polygon.html
  polygon(x, y, radius, npoints){
    var angle = TWO_PI / npoints;
    beginShape();
    for(var a = 0; a < TWO_PI; a += angle){
      var sx = x + Math.cos(a) * radius;
      var sy = y + Math.sin(a) * radius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  } 

  //draw mouseover detection map layer
  displayMap(){
    noStroke(); //turns off outlines (borders can interfere with detection)
    fill(this.mapColor);
    this.polygon(this.x,this.y,this.r,this.SIDES); 
  }

  //draw user viewable layer
  display(){
    stroke('GRAY'); //turn outlines back on for hex display
    fill(this.displayColor);
    this.polygon(this.x,this.y,this.r,this.SIDES);
    fill(0); //text fill color
    textFont('Verdana');
    textSize(this.r / 2.5); //text size is relative to the radius
    textAlign(CENTER);
    text(this.cellText,this.x,this.y + (this.r / 7));
  }
}


//controller: monitors button for events and updates appropriately
//eg: when a button is pressed it must both notify the view to alter display
//and model to signal the audio engine
class CellController{
  constructor(v,m,id){
    this.cellView = v;
    this.cellModel = m;
    this.cellData = this.cellModel.data;
    this.cellView.cellText = this.cellModel.chord.root + this.cellModel.chord.qual;//text to display in a cell
    this.cellNumber = id;//cellNumber is a global variable to keep # of cells
    // numberOfCells++; 
  }

  eventClickedMouseOver(){
    if(mouseIsPressed && red( colorUnderMouse() /* get(mouseX, mouseY)*/ ) == red(this.cellView.mapColor)){
      this.cellView.displayColor = 'BLACK';
      console.log(this.cellNumber);//print the current cell number
    }else{
      this.cellView.displayColor = 'WHITE';
    }
  }
}


//model: currently responsible for holding a chord object to interface the cell
//with the back end. Chords have letters, qualities, and currently hold synth objects.
//in the future, they will have to carry a reference to a global synth object. 
class CellModel{
  constructor(chord){
    this.chord = chord;
  }
}


//wrapper class for cell components
//functions as a public API object in order to hide MVC implimentation
class Cell extends Clickable{
  constructor(x,y,r,displayColor,mapCol,chord){
    super();
    this.cellView = new CellView(x,y,r,displayColor,this.clickMapColor);
    this.cellModel = new CellModel(chord);
    this.cellController = new CellController(this.cellView,this.cellModel,this.clickID);
  }

  displayMap(){
    this.cellView.displayMap();//non-user-viewable mouseover detection layer
  }

  display(){
    this.cellView.displayMap();//non-user-viewable mouseover detection layer
    this.cellController.eventClickedMouseOver();//controller event check
    this.cellView.display();//user-viewable
  }
}
