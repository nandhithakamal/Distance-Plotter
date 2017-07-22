#include <Ultrasonic.h>

Ultrasonic ultrasonic(A0,A1);
long t =0,s=0;
void setup() {
  // initialize the serial communication:
  Serial.begin(9600);
}

void loop() {
  t = millis();
  s = t/1000;
  // send the value of analog input 0:
  Serial.println(ultrasonic.Ranging(CM));
  //Serial.println("Time: " + s);
  // wait a bit for the analog-to-digital converter
  // to stabilize after the last reading:
  delay(500);
}
