///////What can you see of sound? by Yinglian
/*
How to play:
1 - The color and appearance of the pattern by using two potentiometers. 
    Using left one to change pattern(degree), right one change color. 
2 - Using mouse to make all the selections.
3 - In the music playing page, playing different songs by using mouse click 
    on the images.

*/

////////////////////////////Improvement///////////////////////////////
/*
1 - Using for loop to control the songs stop instead of hard coding,
    it can be played as many as songs now.
2 - Adding more songs to test.
3 - Adding more visual elements into 3 typies of music(when the amp values 
    are greater than set values, they will appear)
4 - Adding the time display on the initial page, if it is not triggered,
    it will remain, and it will not return to the initial page after it is triggered
5 - Display the name of each song
6 - Fixed click bugs.
    (Bug:In any page, click "change my mind" area can go to yesMusic page.
         In music playing page, click the gap between images will cause 
         text display overlap.)
7 - LED pattern
*/

////////Fianl Project_Final////////
/*
1 - remove the photocell
2 - Using mouse to control all the seletion in different stage instead of keyboard
3 - Add picture hint on the music playing page, user can click and play different 
    musics and patterns in the same stage instead going back to the previous stage
4 - Using array to store 2 songs in each music section, press mouse to play next one randomly.
    (I just could make 2 songs so far and many bugs needed to fix already.)   

*/

////////Fianl Project - WIP2 ////////
/*
1 - There are 4 sensors send the data from Arduino to Processing.(2 pots,photocell,
    distance sensor.)
2 - Send the amplitude data from Processing to Arduino.
3 - Create a few patterns for difference music.
4 - Parameters Affecting Patterns: amplitude of the song, the values from 
    two pots in Arduino. (I was planning use the distance sensor to change the pattern,
    but not working well, so I use the pots to control.)
    
    One pot changes the shape of pattern(rotate degree), 
    one changes the color. 
    
    The shape is also changed by amplitude. 
    
    The color is also changed by the amplitude.(Slight, base on the amplitude.When not changing the
    value of pot, just can see it.)
5 - Trying to using amplitude to change the brightness of LED Strip, but not working 
    very well.
    
*/

//Fianl Project - WIP 1 ////////
/*
-I'm going to use distance sensor to make a toy which is interactive.
-In WIP1, just test out if I can use the data from the sensor to do something as make the shape change.
-Map the value from sensor to difference scale.
*/

import processing.serial.*;
import processing.sound.*;

//SoundFile dreampop;
//SoundFile lively;
//SoundFile rhythmic;

//Amplitude dreampopamp;
//Amplitude livelyamp;
//Amplitude rhythmicamp;

int songIndex=0;
int songNum = 4;
SoundFile [] dreampop = new SoundFile[songNum];
SoundFile [] lively = new SoundFile[songNum];
SoundFile [] rhythmic = new SoundFile[songNum];

Amplitude [] dreampopamp =new Amplitude[songNum];
Amplitude [] livelyamp =new Amplitude[songNum];
Amplitude [] rhythmicamp =new Amplitude[songNum];

String [] songNameOfDP = new String[songNum];
String [] songNameOfLively = new String[songNum];
String [] songNameOfRhy = new String[songNum];

float amp=0.0;

Serial myPort;
int[] serialInArray = new int[3];    // Create array to store incoming bytes
int serialCount = 0;                 // A count of how many bytes we receive
boolean firstContact = false;        // Whether we're receiving data

int distance;
int valOfPot=0;
int valOfPot2=0;
int widthToPot;
int widthToPot2;
int potToWidth=0;
int pot2ToWidth=0;
int valueOfAmp; //sending this data to Arduino

PImage music1;
PImage music2;
PImage music3;

int page=0; 
/*
page=0 clock;
page=1 dreampop
page=2 lively
page=3 rhythmic
page=4 yesMusic
page=5 noMusic
page=6 welcome
*/

//for making clock
int hr;
int mn;
int sc;

Circle[] circles = new Circle[250];

PFont font; //for display the clock
PFont font2; //for display the name of songs

PVector location;
PVector velocity;

void setup() {
  //size(1000,1000);
  size(1200,1200);
  //fullScreen(2);
  smooth();
  printArray(Serial.list());
  String portName = Serial.list()[1];
  myPort = new Serial(this,portName,9600);
    
  music1 = loadImage("dreampop.jpeg");
  music2 = loadImage("lively.jpeg");
  music3 = loadImage("rhythmic.jpeg");
   
  //rhythmic = new SoundFile(this,"Austerlitz.aiff");
  //rhythmicamp = new Amplitude(this);
  //rhythmicamp.input(rhythmic);
  
  //dreampop = new SoundFile(this,"Space-Song.aiff");
  //dreampopamp = new Amplitude(this);
  //dreampopamp.input(dreampop);
  
  //lively = new SoundFile(this,"Hanuman.aiff");
  //livelyamp = new Amplitude(this);
  //livelyamp.input(lively);
  
  for(int i=0; i<songNum;i++){
      rhythmic[i] = new SoundFile(this,("rhythmic"+i+".aiff"));
      rhythmicamp[i] = new Amplitude(this);
      rhythmicamp[i].input(rhythmic[i]);
      
      dreampop[i] = new SoundFile(this,("dreampop"+i+".aiff"));
      dreampopamp[i] = new Amplitude(this);
      dreampopamp[i].input(dreampop[i]);
      
      lively[i] = new SoundFile(this,("lively"+i+".aiff"));
      livelyamp[i] = new Amplitude(this);
      livelyamp[i].input(lively[i]);
  }
  
  songNameOfDP[0] = "Hurts to Love - Beach House";
  songNameOfDP[1] = "Space Song - Beach House";
  songNameOfDP[2] = "Lemon Glow - Beach House";
  songNameOfDP[3] = "Over and Over - Beach House";

  songNameOfLively[0] = "Ohayoo Ohio - Pink Martini";
  songNameOfLively[1] = "Hanuman - Rodrigo y Gabriela";
  songNameOfLively[2] = "Rebirth of Cool - DJ Cam";
  songNameOfLively[3] = "Canals - Joakim Karud";
  
  songNameOfRhy[0] = "Austerlitz - Jo Blankenburg";
  songNameOfRhy[1] = "Kaligula - Jo Blankenburg";
  songNameOfRhy[2] = "Trigger Nation - Jo Blankenburg";
  songNameOfRhy[3] = "Radioactive - Imagine Dragons";
  
  font = createFont("Anton-Regular.ttf",width/6);
  font2 = loadFont("Helvetica-18.vlw");
  
  //initialize circles objects for using in dreampop 
  for (int i =0; i<circles.length; i++){
    circles[i] = new Circle(int(random(50,width-50)), int(random(height/2-20,height/2+20)),
                     int(random(5,300)),int(random(5,30)));
  } 
  
  location = new PVector(100,335);
  velocity = new PVector(4.0,5.5);
    
}


void draw() {
  valueOfAmp = int(map(amp,0,1,0,255)); //mapping the value to send to Arduino
  myPort.write(valueOfAmp);
  ////println(valueOfAmp);
  
  //mapping the values from 2 pots into the range of width
  potToWidth = int(map(valOfPot,0,255,0,width));
  pot2ToWidth = int(map(valOfPot2,0,255,0,width));
  
  //remapping these value to make big changing when using pot to 
  //control the color and shape
  widthToPot = int(map(pot2ToWidth,0,width,0,255));
  widthToPot2 = int(map(pot2ToWidth,0,width,255,0));
  
    if (page ==1){
        pattern_dreampop();
        songName();
  }else if (page ==2) {
        pattern_lively();
        songName();
  }else if (page == 3) {
        pattern_rhy();
        songName();
  }else if(page ==4) {
        yesMusic();
  }else if(page==5) {
        noMusic();
  }else if (distance <50){
        welcomePage(); 
        page = 6;
  }else if(page ==0) {
        clock();
  }
  
  //else if(page !=1 && page !=2 && page !=3 && page !=4 && page !=5 && page !=6 && distance >=50 ){
  //      clock();  
  //}
  
  //println("Amp: " + amp);
  
  //save pic
  if(keyPressed){
    saveFrame("screenshot/pattern - ######.png");
  }
}

//Copy the Serial_Handshaking code
void serialEvent(Serial myPort) {
  // read a byte from the serial port:
  int inByte = myPort.read();
  // if this is the first byte received, and it's an A, clear the serial
  // buffer and note that you've had first contact from the microcontroller.
  // Otherwise, add the incoming byte to the array:
  if (firstContact == false) {
    if (inByte == 'A') {
      myPort.clear();          // clear the serial port buffer
      firstContact = true;     // you've had first contact from the microcontroller
      myPort.write('A');       // ask for more
    }
  } else {
    // Add the latest byte from the serial port to array:
    serialInArray[serialCount] = inByte;
    serialCount++;

    // If we have 3 bytes:
    if (serialCount > 2 ) {
      distance = serialInArray[0];
      //valueOfPhC = serialInArray[1];
      valOfPot = serialInArray[1];
      valOfPot2 = serialInArray[2];

      println(distance + "\t" + valOfPot + "\t"+ valOfPot2);

      // Send a capital A to request new sensor readings:
      myPort.write('A');
      // Reset serialCount:
      serialCount = 0;
    }
  }
}


//void keyPressed(){
//      if(key =='1'){
//        clear();
//        page = 1; 
//        dreampop.play();
//        lively.stop();
//        rhythmic.stop();
//      }else if(key == '2'){
//        clear();
//        page = 2;  
//        lively.play();
//        dreampop.stop();
//        rhythmic.stop();
//      }else if (key =='3'){
//        clear();
//        page = 3;  
//        rhythmic.play();
//        dreampop.stop();
//        lively.stop();
//      }else if (key == 'y'|| key=='Y'){
//        clear();
//        page = 4;  
        
//      }else if (key == 'n' || key=='N') {
//        clear();
//        page = 5; 
//      }
      
//}

//using mouse to control all the selections in different stage
void mousePressed() {
  
  if((page ==1 || page ==2 || page ==3) 
      && ((mouseX>width/10*8 && mouseX< width/10*8+50 ) 
      || (mouseX>width/10*8+60 && mouseX< width/10*8+110) 
      || (mouseX>width/10*8+120 && mouseX< width/10*8+170))
      && mouseY >height/10*9+25 && mouseY <height/10*9+75){
       
           songIndex=int(random(0,songNum));
           //println("songIndex: "+songIndex);

       }
         
  if(mouseX>width/5*2-45 && mouseX<width/5*2+45 
     && mouseY>height/2+55 && mouseY < height/2+115
     && page ==6){
          clear();
          page =4; //In welcome page click "yes", go to yesMusic page

  } else if(mouseX>width/5*2+190 && mouseX<width/5*2+280 
            && mouseY>height/2+55 && mouseY < height/2+115 
            && page ==6){
            clear();
            page =5; //In welcome page click "no", go to noMusic page
            
  } else if (mouseX> width/3*2-122 && mouseX< width/3*2-122+245 
             && mouseY >height/5*3-38 && mouseY <height/5*3-38+50 
             && page==5){
            clear();
            page =4; //Click"Change my mind" from noMusic page to back to yesMusic page
          
  } else if(mouseX > width/3*1-150*1 && mouseX < width/3*1-150*1+200 
          && mouseY > height/5*3 && mouseY < height/5*3+200 
          && page ==4){
            
          clear();
          page =1; //In yesMusic page, go dreampop Music page
       
       for (int i = 0; i < lively.length; i++) {
          lively[i].stop();
       }
       for (int i = 0; i < rhythmic.length; i++) {
          rhythmic[i].stop();
       }
       
          dreampop[songIndex].play();
       
       //lively[0].stop();
       //lively[1].stop();

       //rhythmic[0].stop();
       //rhythmic[1].stop();
  } else if (mouseX > width/3*2-150*2 && mouseX < width/3*2-150*2+200+50 
            && mouseY > height/5*3 && mouseY < height/5*3+200 
            && page ==4){
              
          clear();
          page = 2; //In yesMusic page, go lively Music page
      
      for (int i = 0; i < dreampop.length; i++) {
          dreampop[i].stop();
       }
       
      for (int i = 0; i < rhythmic.length; i++) {
          rhythmic[i].stop();
       }
          lively[songIndex].play();
          
      //dreampop[0].stop();
      //dreampop[1].stop();
      //rhythmic[0].stop();
      //rhythmic[1].stop();
      
  } else if (mouseX > width/3*3-150*3 && mouseX < width/3*3-150*3+200 
             && mouseY > height/5*3 && mouseY < height/5*3+200 
             && page ==4){
               
            clear();
            page = 3; // In yesMusic page, go rhythmic Music page
         
         for (int i = 0; i < dreampop.length; i++) {
            dreampop[i].stop();
         }
         
         for (int i = 0; i < lively.length; i++) {
            lively[i].stop();
         }
         
            rhythmic[songIndex].play();
            
        //dreampop[0].stop();
        //dreampop[1].stop();
        //lively[0].stop();
        //lively[1].stop();  
      
  } else if (mouseX>width/10*8 && mouseX< width/10*8+50 
              && mouseY >height/10*9+25 && mouseY <height/10*9+75 
              && (page ==1 || page ==2 || page ==3) ){
      
            clear();
            page = 1; //in music playing page, click on dreampop image to change other songs
            
        //if (songIndex==0){
          
        //dreampop[songIndex+1].stop();
        //dreampop[songIndex].stop();
        //dreampop[songIndex].play();
        //lively[0].stop();
        //lively[1].stop();
        //rhythmic[0].stop();
        //rhythmic[1].stop();
        //} else if (songIndex==1){
          
        //dreampop[songIndex].stop();
        //dreampop[songIndex-1].stop();
        //dreampop[songIndex].play();
        //lively[0].stop();
        //lively[1].stop();
        //rhythmic[0].stop();
        //rhythmic[1].stop();
        //}
        
        //Using for loop to control the songs play and stop
        for (int i=0; i<dreampop.length;i++){
          dreampop[i].stop();
        }
        
        for (int i=0; i<lively.length;i++){
          lively[i].stop();
        }
        
        for (int i=0; i<rhythmic.length;i++){
          rhythmic[i].stop();
        }
        
          dreampop[songIndex].play();
        
  } else if (mouseX>width/10*8+60 && mouseX< width/10*8+110 
            && mouseY >height/10*9+25 && mouseY <height/10*9+75 
             && (page ==1 || page ==2 || page ==3)){
               
          clear();
          page = 2; //in music playing page, click on lively image to change other songs
         
        //if (songIndex==0){
        //  lively[songIndex+1].stop();
        //  lively[songIndex].stop();
        //  lively[songIndex].play();
        //  dreampop[0].stop();
        //  dreampop[1].stop();
        //  rhythmic[0].stop();
        //  rhythmic[1].stop();
        //} else if (songIndex==1){
        //  lively[songIndex].stop();
        //  lively[songIndex-1].stop();
        //  lively[songIndex].play();
        //  dreampop[0].stop();
        //  dreampop[1].stop();
        //  rhythmic[0].stop();
        //  rhythmic[1].stop();
        //}
        
        //Using for loop to control the songs play and stop
        for (int i=0; i<dreampop.length;i++){
          dreampop[i].stop();
        }
        
        for (int i=0; i<lively.length;i++){
          lively[i].stop();
        }
        
        for (int i=0; i<rhythmic.length;i++){
          rhythmic[i].stop();
        }
        
          lively[songIndex].play();
     
              
       }else if (mouseX>width/10*8+120 && mouseX< width/10*8+170 && mouseY >height/10*9+25 && mouseY <height/10*9+75 
              && (page ==1 || page ==2 || page ==3)){
           clear();
           page = 3; //in music playing page, click on rhythmic image to change other songs
          
       // if (songIndex==0){
       //    rhythmic[songIndex].stop();
       //    rhythmic[songIndex+1].stop();
       //     rhythmic[songIndex].play();
       //     dreampop[0].stop();
       //     dreampop[1].stop();
       //     lively[0].stop();
       //     lively[1].stop();
       // } else if (songIndex==1){
       //   rhythmic[songIndex].stop();
       //   rhythmic[songIndex-1].stop();
       //   rhythmic[songIndex].play();
       //   dreampop[0].stop();
       //   dreampop[1].stop();
       //   lively[0].stop();
       //   lively[1].stop();
       // }
      
        //Using for loop to control the songs play and stop
        for (int i=0; i<dreampop.length;i++){
          dreampop[i].stop();
        }
        
        for (int i=0; i<lively.length;i++){
          lively[i].stop();
        }
        
        for (int i=0; i<rhythmic.length;i++){
          rhythmic[i].stop();
        }
        
          rhythmic[songIndex].play(); 
        
          }   
          
}

////////////////////////////////Define functions/////////////////////////////////////////

void pichint(){
  image(music1,width/10*8,height/10*9+25,50,50);
  image(music2,width/10*8+60,height/10*9+25,50,50);
  image(music3,width/10*8+120,height/10*9+25,50,50);
}

void welcomePage() {
     
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(86);
  text("Welcome back!",width/2,height/2-100);
  textSize(50);
  text("Would you like to listen music?",width/2,height/2);
  textSize(42);
  
  fill(255);
  rectMode(CORNER);
  noStroke();
  rect(width/5*2-45,height/2+55,90,60);
  rect(width/5*2+190,height/2+55,90,60);
  
  fill(0);
  text("YES",width/5*2,height/2+100);
  text("NO",width/5*3,height/2+100);
  
}

void yesMusic() {
  background(0);
  fill(200);
  rectMode(CENTER);
  noStroke();
  rect(width/2,height/2-150,350,250);
  rect(width/2-200,height/2-150,50,25);
  rect(width/2+200,height/2-150,50,25);
  fill(45);
  ellipse(width/2-50,height/2-150,60,60);
  ellipse(width/2+50,height/2-150,60,60);
  ellipse(width/2,height/2-90,15,15);
  
  textSize(35);
  fill(255);
  textAlign(CENTER);
  text("How to play",width/2,height/5);
  textSize(25);
  text("Change shape",width/2-270,height/2-200);
  text("Change color",width/2+280,height/2-200);
  stroke(255);
  strokeWeight(3);
  line(width/2-270,height/2-195,width/2-230,height/2-150);
  line(width/2+270,height/2-195,width/2+230,height/2-150);
  
  image(music1,width/3*1-150*1,height/5*3,200,200);
  image(music2,width/3*2-150*2,height/5*3,200,200);
  image(music3,width/3*3-150*3,height/5*3,200,200);
  
  textSize(32);
  text("Pick an image you like.",width/2,height/6*5+50);
  text("I will pick a song for you.",width/2,height/6*5+90);
  

}

void noMusic() {
  background(0);
  textSize(75);
  fill(255);
  textAlign(CENTER);
  text("I'm here for you!",width/2,height/5*2);
  
  rectMode(CORNER);
  noStroke();
  fill(255);
  rect(width/3*2-122,height/5*3-38,245,50);
  
  fill(0);
  textSize(32);
  text("Change my mind", width/3*2,height/5*3);
}




////////////////////////////PATTERNS//////////////////////////////////



//point, pattern for dream pop music
void pattern_dreampop(){
  pichint();
  rectMode(CORNER);
  noStroke();
  fill(widthToPot,widthToPot2,int(255-255*amp),20);
 
  //fill(map(widthToPot2,0,255,0,150),int(255-255*amp),widthToPot,10);
  //fill(widthToPot,int(255-255*amp),widthToPot2,20);
  //fill(map((255-255*amp),0,255,0,75),widthToPot*amp,widthToPot2,20);
  //fill(widthToPot,map(widthToPot2,0,255,0,127),int(255-255*amp),20);
  //fill(int(255-255*amp),map(widthToPot2,0,255,0,127),widthToPot,20);
  //fill(widthToPot,map(widthToPot2,0,255,0,127),map(int(255-255*amp),0,255,255,0),20);
  //fill(map(int(255-255*amp),0,255,255,0),20);
  rect(0,0,width,height);
  
  noFill();
  //fill(widthToPot,widthToPot2,int(255-255*amp));
  strokeWeight(random(2,10));
  //stroke(255,255-amp*255);
   stroke(255);
  //stroke(int(255-255*amp));
  
  
  //lively.stop();
  //rhythmic.stop();
  //dreampop.play();

  amp = dreampopamp[songIndex].analyze();
  
  potToWidth = int(map(valOfPot,0,255,0,width));
  float deg = map(potToWidth, 0, width,30,1);
    
  
   for(int i=0; i< 360; i+=deg) {
       pushMatrix();
     
         translate(width/2, height/2);
         float angle = radians(i);
         rotate(angle);
         point(width/2-amp*width/2,height/2-amp*height/2);
        
       popMatrix();
   }
   
   if(amp>0.475){
      circle();
    }
  
}


//line, pattern for lively music
void pattern_lively(){
  pichint();
  rectMode(CORNER);
  noStroke();
  fill(widthToPot,widthToPot2,int(255-255*amp),10);
  //fill(widthToPot2,int(255-255*amp),widthToPot,20);
  rect(0,0,width,height);

  //noFill();
  strokeWeight(random(1,2));
  stroke(255);
  
   //dreampop.stop();
   //rhythmic.stop();
   //lively.play();
 
  amp = livelyamp[songIndex].analyze();
  
  potToWidth = int(map(valOfPot,0,255,0,width));
  float deg = map(potToWidth, 0, width,120,1);
  
  for(int i=0; i<360; i+=deg) {
    pushMatrix();
      translate(width/2, height/2);
      float angle = radians(i);
      rotate(angle);
      line(width/2-amp*width/2,0,amp*width/2,amp*height/2);
      
    popMatrix();
  }
  
   //circleForLine();
   pointForBg2();
  
}


//triangle, pattern for rhythmic mousic
void pattern_rhy(){
  pichint();
  rectMode(CORNER);
  noStroke();
  fill(widthToPot,widthToPot2,int(255-255*amp),10);
  //fill(int(255-255*amp),widthToPot2,widthToPot,20);
  rect(0,0,width,height);
  noFill();
  strokeWeight(2);
  stroke(255,255,255);
  
    //rhythmic.play();
    //dreampop.stop();
    //lively.stop();
    
  amp = rhythmicamp[songIndex].analyze();

  potToWidth = int(map(valOfPot,0,255,0,width));
  int deg =int(map(potToWidth,0,width,90,1));
  
  for(int i=1; i< 360; i+=deg) {
    pushMatrix();
      translate(width/2, height/2);
      float angle = radians(i);
      rotate(angle);
      triangle(width/2-amp*width/2,0,amp*width/2,amp*height/2,amp*width/2/tan(30),amp*height/4);
       
    popMatrix();
  }  
  
  pointForBg();
}

//for dream pop music
void circle(){
  for(int i=0; i<circles.length; i++){
    circles[i].display();

  }
}

// for lively music
//void circleForLine(){
//  for(int i = 0; i<width/2;i+=100){
//  fill(255,amp*15);
//  noStroke();
//  ellipse(width/2,height/2,i*amp,i*amp);
//  }
//}

//for rhythmic mousic
void pointForBg(){
  
  if(amp>0.85){
      for(int i = 0; i<width;i+=50){
        for(int j =0; j<height;j+=50){
        stroke(255,noise(amp)*40);
        //stroke(255,random(amp)*40);
        strokeWeight(amp*40);
        point(random(i),random(j));
        }
      }
  }
  
}

// for lively music bg
void  pointForBg2(){ 
  int a = 100;
  int b = 27;
  int c = 18;
  for(int i = 20; i<=width-10;i+=50){
    for(int j =height/6*2+10; j<=height/6*4-10;j+=50){
    stroke(255,amp*a);
    strokeWeight(noise(amp)*random(c,b));
    point(i,j);
    }
  }
    for(int i = width/6*2+20; i<=width/6*4-20;i+=50){
      for(int j =20; j<=height/6*2-20;j+=50){
      stroke(255,amp*a);
      strokeWeight(noise(amp)*random(c,b));
      point(i,j);
      }
  }
  
      for(int i = width/6*2+20; i<=width/6*4-20;i+=50){
    for(int j =height/6*4+20; j<=height-20;j+=50){
    stroke(255,amp*a);
    strokeWeight(noise(amp)*random(c,b));
    point(i,j);
    }
  }
  
}

void clock(){
      background(0); 
      
      //make a moving rectage
      location.add(velocity);
        
        if((location.x > 1050) || (location.x  < 100)){
          
          velocity.x = velocity.x *-1;
        
        }
        
        if((location.y > 660) || (location.y < 335)){
          velocity.y = velocity.y * -1;
        }
        
        //outside rectangle
        rectMode(CORNER);
        strokeWeight(2);
        stroke(250,175);
        fill(255,20);
        rect(80,315,1040,390,28);
        
        //background rectangle
        noStroke();
        fill(255,20);
        rect(100,335,1000,350);
        
        //second counter rectangle
        noStroke();
        float scMap = map(sc,0,60,100,1000);
        fill(20,int(map(sc,0,60,50,150)),int(map(sc,0,60,100,20)));
        rect(100,335,scMap,350);
       
        //bouncing rectangle
        fill(255);
        rect(location.x, location.y,50,20);
        
        hr=hour();
        mn=minute();
        sc=second();
        
        fill(250);
        textFont(font);
        //textSize(width/7);
        textAlign(CENTER);
        text(hr+" : "+ mn+ " : "+ sc,width/2,height/2);
}

void songName() {
    if (page==1){
    fill(255);
    textFont(font2);
    //textSize(20);
    textAlign(CENTER);
    text(songNameOfDP[songIndex],width/7*6+20,height/7*6+160);
    } else if (page == 2){
    fill(255);
    textFont(font2);
    //textSize(20);
    textAlign(CENTER);
    text(songNameOfLively[songIndex],width/7*6+20,height/7*6+160);
    } else if (page ==3) {
    fill(255);
    textFont(font2);
    //textSize(20);
    textAlign(CENTER);
    text(songNameOfRhy[songIndex],width/7*6+20,height/7*6+160);
    }
}
