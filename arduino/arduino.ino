#define DEBUG

const int LATCH_PIN = 4; // ST_CP
const int CLOCK_PIN = 7; // SH_CP
const int DATA_PIN = 2; // DS

void setup() {
  pinMode(LED_BUILTIN, OUTPUT); // Keeps built in LED off
  pinMode(LATCH_PIN, OUTPUT);
  pinMode(CLOCK_PIN, OUTPUT);
  pinMode(DATA_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("READY");
}

void updateDisplay(byte data) {
  digitalWrite(LATCH_PIN, LOW);
  shiftOut(DATA_PIN, CLOCK_PIN, LSBFIRST, data);
  digitalWrite(LATCH_PIN, HIGH);
}

void displayNotification() {
  const byte fivePin[] = {
    0b10000000, 0b01000000, 0b00100000, 0b00010000, 0b00001000,
    0b00010000, 0b00100000, 0b01000000, 0b10000000,
    0x0, 0xF8, 0x0, 0xF8
  };

  short numberOfFrames = sizeof(fivePin)/sizeof(fivePin[0]);

  for (byte i = 0; i < numberOfFrames; i++) {
    updateDisplay(fivePin[i]);
    delay(100);
  }
  updateDisplay(0x00);
}

void printBuffer(byte* buff, int bufferSize) {
  // Print buffer
  for (int i = 0; i < bufferSize; i++) {
    Serial.print(buff[i], HEX);
    Serial.print(" ");
  }
  Serial.println("");
}

byte data = 0x00;
unsigned short speeds[] = {0,0,0,0,0,0,0,0};
unsigned int timers[] = {0,0,0,0,0,0,0,0};
long lastUpdate = 0;
void updateData() {
  long now = millis();
  long delta = now - lastUpdate;
  lastUpdate = now;
  for (int i = 0; i < 8; i++) {
    if (speeds[i] != 0) {
      timers[i] += delta;
      if (timers[i] >= speeds[i]) {
        timers[i] -= speeds[i];
        data ^= 1 << i;
      }
    }
  }
}

#pragma pack(push, 1)
struct TimerInfo {
  unsigned short updateSpeed;
  byte timerNumber;
};
#pragma pack(pop)

void updateTimers() {
  byte numberOfTimers;
  Serial.readBytes(&numberOfTimers, 1);
  int bufferSize = numberOfTimers*sizeof(TimerInfo);
  byte buff[bufferSize];

  Serial.readBytes(buff, bufferSize);

  TimerInfo *infos = (TimerInfo*)buff;

  for (int i = 0; i < numberOfTimers; i++) {
    TimerInfo timerInfo = infos[i];
    if (timerInfo.timerNumber > 7) continue;
    speeds[timerInfo.timerNumber] = timerInfo.updateSpeed;
    #ifdef DEBUG
    Serial.print("Timer Number -> ");
    Serial.println(timerInfo.timerNumber);
    Serial.print("Update Speed -> ");
    Serial.println(timerInfo.updateSpeed);
    #endif
  }
}

void processCommand(byte commandType) {
  switch(commandType) {
    case 0x01: // Display notification
      displayNotification();
      break;
    case 0x02:
      updateTimers();
      break;
    default:
      Serial.print("ERROR: Unknown command type: 0x");
      Serial.println(commandType, HEX);
      break;
  }
}

void loop() {
  if (Serial.available()) {
    byte commandType = Serial.read();
    processCommand(commandType);
  }

  updateData();
  updateDisplay(data);
}
