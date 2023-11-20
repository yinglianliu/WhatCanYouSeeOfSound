#include <FastLED.h>
#define led_Pin 13
#define NUM_LEDS 40
CRGB leds[NUM_LEDS];

const int trigPin = 11;
const int echoPin = 10;
const int potPin = A0;
const int potPin2 = A5;

int pingTime;
float distance;
int valDistance=0;
int valOfPot=0;
int valOfPot2=0;
int inByte = 0;
int valueOfAmp;
int ampMap;
int ampMap2;
int ampMap3;
int ampMap4;

void setup() {
  Serial.begin(9600);

  while (!Serial) {
    ;
    }
    
  pinMode(trigPin,OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(potPin,INPUT);
  pinMode(potPin2,INPUT);
  
  establishContact();
  
  FastLED.addLeds<WS2812,led_Pin, GRB>(leds,NUM_LEDS);
  FastLED.setMaxPowerInVoltsAndMilliamps(5,500);
  FastLED.clear();
  FastLED.show();

}

void loop() {
  digitalWrite(trigPin,LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  pingTime = pulseIn(echoPin,HIGH);
  distance = (pingTime * 0.0343)/2;
  delay(10);

  //  Serial.print("Distance: ");
//  Serial.print(distance);
//  Serial.println(".cm");
//  delay(500);
  
    if(Serial.available()>0) {
       inByte = Serial.read();
       delay(10);
       valueOfAmp = Serial.read();
        delay(10);
        
    valOfPot = map(analogRead(potPin),0,1023,0,255);
    //delay(10);
    valOfPot2 = map(analogRead(potPin2),0,1023,0,255);
    //delay(10);
  
    Serial.write(int(distance));
    //delay(10);
    Serial.write(valOfPot);
     //delay(10);
    Serial.write(valOfPot2);
     //delay(10);

   }
   


    ampMap=map(valueOfAmp,0,255,6,0);
    ampMap2 = map(valueOfAmp,0,255,255,0);
    ampMap3 = map(valueOfAmp,0,255,0,40);
    ampMap4 = map(valueOfAmp,0,255,10,0);
    

      if (valueOfAmp>90){
   
          for(int i=0; i<NUM_LEDS;i+=2){
            
              leds[i] = CRGB(valueOfAmp,255-valueOfAmp,ampMap*i);
              FastLED.setBrightness(30);
              FastLED.show();
              //delay(ampMap4);
              }   
    
           for(int i=1; i<NUM_LEDS;i+=2){
            
              leds[i] = CRGB(255-valueOfAmp,ampMap*i,valueOfAmp);
              FastLED.setBrightness(30);
              FastLED.show();
              //delay(ampMap4);
              }   

            for(int i=0; i<NUM_LEDS;i++){
            
              leds[i] = CRGB(valueOfAmp,ampMap*i,255-valueOfAmp);
              FastLED.setBrightness(30);
              FastLED.show();
              //delay(5);
              }   
         
        }else if(valueOfAmp<=90 && valueOfAmp >0){
            for(int i=1; i<NUM_LEDS;i+=2){
              
                leds[i] = CRGB(valueOfAmp,ampMap2,255-valueOfAmp);
                FastLED.setBrightness(10);
                FastLED.show();
                //delay(20);
              }   

              for(int i=0; i<NUM_LEDS;i+=2){
              
                leds[i] = CRGB(ampMap2,255-valueOfAmp,valueOfAmp);
                FastLED.setBrightness(10);
                FastLED.show();
                //delay(5);
              }   
          
          }else if (distance<50 && valueOfAmp==0) {
            for(int i=0; i<NUM_LEDS;i++){
              leds[i] = CRGB(75,75,75);
              FastLED.setBrightness(50);
              FastLED.show(); 
              delay(10); 
            }
        }else {
              for(int i=0; i<NUM_LEDS;i++){
              leds[i] = CRGB(75,0,127);
              FastLED.setBrightness(0);
              FastLED.show(); 
              //delay(10); 
              }
            }
}

void establishContact(){
  while (Serial.available() <=0) {
    Serial.print('A');
    delay(100);
    }
  }
