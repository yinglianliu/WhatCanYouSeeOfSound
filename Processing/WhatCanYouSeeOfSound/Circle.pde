class Circle{
  int x,y;
  int diameter;
  int transparency;
  
  Circle(int tempX, int tempY, int tempD, int tempT){
    x= tempX;
    y= tempY;
    diameter = tempD;
    transparency = tempT;
  }
  
  void display(){
    //strokeWeight(random(2));
    //stroke(#FBFFD1,random(transparency));
    noStroke();
    fill(int(255),int(random(transparency*amp)));
    ellipse(x,y,diameter*amp,diameter*amp);
  }
 
  
}
