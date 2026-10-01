#define BLYNK_TEMPLATE_ID "TMPL6cApWdZfH"
#define BLYNK_TEMPLATE_NAME "Smart Greenhouse"
#define BLYNK_AUTH_TOKEN "GhwnqULnRj_T4gF9_In5eUECUgEk9vIO"

#include <WiFi.h>
#include <BlynkSimpleEsp32.h>
#include <DHT.h>
#include <ESP32Servo.h>
#include <Wire.h>

// =====================================================
// WiFi
// =====================================================
char ssid[] = "Austian";
char pass[] = "austMFAAZAP";

// =====================================================
// PIN DEFINITIONS
// =====================================================
#define DHT_PIN       4
#define SOIL_PIN      34
#define RAIN_PIN      32
#define LDR_PIN       35

#define SERVO_PIN     13

#define PUMP_RELAY    26
#define LIGHT_RELAY   25
#define FAN_RELAY     33

#define LCD_SDA       21
#define LCD_SCL       22

#define LCD_ADDR      0x27

// =====================================================
// SENSOR
// =====================================================
#define DHTTYPE DHT22
DHT dht(DHT_PIN, DHTTYPE);

Servo roofServo;

BlynkTimer timer;

// =====================================================
// VARIABLES
// =====================================================
bool autoMode = true;

bool pumpState = false;
bool fanState = false;
bool lightState = false;
bool roofClosed = false;

float temperature = 0;
float humidity = 0;

int soilValue = 0;
int rainValue = 0;
int ldrValue = 0;

// =====================================================
// THRESHOLDS
// =====================================================

// Soil
#define SOIL_PUMP_ON   3000
#define SOIL_PUMP_OFF  2500

// Rain
#define RAIN_THRESHOLD 3500

// Fan
#define FAN_ON_TEMP    30.0
#define FAN_OFF_TEMP   28.0

// =====================================================
// LCD LOW LEVEL DRIVER
// =====================================================

void lcdWrite4Bits(byte data)
{
  Wire.beginTransmission(LCD_ADDR);
  Wire.write(data | 0x08);
  Wire.endTransmission();

  Wire.beginTransmission(LCD_ADDR);
  Wire.write(data | 0x0C);
  Wire.endTransmission();

  Wire.beginTransmission(LCD_ADDR);
  Wire.write(data | 0x08);
  Wire.endTransmission();
}

void lcdCommand(byte cmd)
{
  lcdWrite4Bits(cmd & 0xF0);
  lcdWrite4Bits((cmd << 4) & 0xF0);
}

void lcdData(byte data)
{
  lcdWrite4Bits((data & 0xF0) | 0x01);
  lcdWrite4Bits(((data << 4) & 0xF0) | 0x01);
}

void lcdClear()
{
  lcdCommand(0x01);
  delay(2);
}

void lcdSetCursor(byte col, byte row)
{
  byte address;

  if (row == 0)
    address = 0x80 + col;
  else
    address = 0xC0 + col;

  lcdCommand(address);
}

void lcdPrint(String text)
{
  for (int i = 0; i < text.length(); i++)
  {
    lcdData(text[i]);
  }
}

void lcdPrintLine(byte row, String text)
{
  lcdSetCursor(0, row);

  while (text.length() < 16)
  {
    text += " ";
  }

  if (text.length() > 16)
  {
    text = text.substring(0, 16);
  }

  lcdPrint(text);
}

void lcdInit()
{
  Wire.begin(LCD_SDA, LCD_SCL);

  delay(50);

  lcdWrite4Bits(0x30);
  delay(5);

  lcdWrite4Bits(0x30);
  delay(1);

  lcdWrite4Bits(0x30);
  delay(1);

  lcdWrite4Bits(0x20);
  delay(1);

  lcdCommand(0x28);
  lcdCommand(0x0C);
  lcdCommand(0x01);

  delay(2);

  lcdCommand(0x06);
}

// =====================================================
// RELAY CONTROL
// LOW = ON
// HIGH = OFF
// =====================================================

void setPump(bool state)
{
  pumpState = state;

  if (state)
    digitalWrite(PUMP_RELAY, LOW);
  else
    digitalWrite(PUMP_RELAY, HIGH);
}

void setFan(bool state)
{
  fanState = state;

  if (state)
    digitalWrite(FAN_RELAY, LOW);
  else
    digitalWrite(FAN_RELAY, HIGH);
}

void setLight(bool state)
{
  lightState = state;

  if (state)
    digitalWrite(LIGHT_RELAY, LOW);
  else
    digitalWrite(LIGHT_RELAY, HIGH);
}

// =====================================================
// ROOF CONTROL
// =====================================================

void closeRoof()
{
  roofServo.write(0);
  roofClosed = true;
}

void openRoof()
{
  roofServo.write(90);
  roofClosed = false;
}

// =====================================================
// BLYNK AUTO / MANUAL
// V0
// 1 = AUTO
// 0 = MANUAL
// =====================================================

BLYNK_WRITE(V0)
{
  int value = param.asInt();

  if (value == 1)
    autoMode = true;
  else
    autoMode = false;

  Serial.print("Mode: ");

  if (autoMode)
    Serial.println("AUTO");
  else
    Serial.println("MANUAL");
}

// =====================================================
// MANUAL PUMP V12
// =====================================================

BLYNK_WRITE(V12)
{
  if (!autoMode)
  {
    setPump(param.asInt());
  }
}

// =====================================================
// MANUAL FAN V13
// =====================================================

BLYNK_WRITE(V13)
{
  if (!autoMode)
  {
    setFan(param.asInt());
  }
}

// =====================================================
// MANUAL LIGHT V14
// =====================================================

BLYNK_WRITE(V14)
{
  if (!autoMode)
  {
    setLight(param.asInt());
  }
}

// =====================================================
// MANUAL ROOF V15
// 1 = CLOSE
// 0 = OPEN
// =====================================================

BLYNK_WRITE(V15)
{
  if (!autoMode)
  {
    if (param.asInt() == 1)
      closeRoof();
    else
      openRoof();
  }
}

// =====================================================
// SENSOR READING + AUTO CONTROL
// =====================================================

void readSensors()
{
  // ===================================================
  // DHT22
  // ===================================================

  float newTemp = dht.readTemperature();
  float newHum = dht.readHumidity();

  if (!isnan(newTemp))
    temperature = newTemp;

  if (!isnan(newHum))
    humidity = newHum;

  // ===================================================
  // SOIL
  // ===================================================

  soilValue = analogRead(SOIL_PIN);

  // ===================================================
  // RAIN
  // ===================================================

  rainValue = analogRead(RAIN_PIN);

  // ===================================================
  // LDR
  // LOW = BRIGHT
  // HIGH = DARK
  // ===================================================

  // Direct reading:
  // Dark  -> HIGH
  // Bright -> LOW

  ldrValue = digitalRead(LDR_PIN);

  // ===================================================
  // AUTO MODE
  // ===================================================

  if (autoMode)
  {
    // -------------------------------------------------
    // SOIL → PUMP
    // -------------------------------------------------

    if (soilValue >= SOIL_PUMP_ON)
    {
      setPump(true);
    }
    else if (soilValue <= SOIL_PUMP_OFF)
    {
      setPump(false);
    }

    // -------------------------------------------------
    // TEMPERATURE → FAN
    // -------------------------------------------------

    if (!isnan(newTemp))
    {
      if (temperature >= FAN_ON_TEMP)
      {
        setFan(true);
      }
      else if (temperature <= FAN_OFF_TEMP)
      {
        setFan(false);
      }
    }

    // -------------------------------------------------
    // LDR → LIGHT
    // HIGH = DARK
    // LOW = BRIGHT
    // -------------------------------------------------

    if (ldrValue == 1) {
      setLight(true);    
    }
    else {
      setLight(false);   
    }

    // -------------------------------------------------
    // RAIN → ROOF
    // -------------------------------------------------

    if (rainValue < RAIN_THRESHOLD)
    {
      closeRoof();
    }
    else
    {
      openRoof();
    }
  }

  // ===================================================
  // SERIAL MONITOR
  // ===================================================

  Serial.println("--------------------------------");

  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" C");

  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");

  Serial.print("Soil: ");
  Serial.println(soilValue);

  Serial.print("Rain: ");
  Serial.println(rainValue);

  Serial.print("LDR: ");

  if (ldrValue == HIGH)
    Serial.println("DARK");
  else
    Serial.println("BRIGHT");

  Serial.print("Pump: ");
  Serial.println(pumpState ? "ON" : "OFF");

  Serial.print("Fan: ");
  Serial.println(fanState ? "ON" : "OFF");

  Serial.print("Light: ");
  Serial.println(lightState ? "ON" : "OFF");

  Serial.print("Roof: ");
  Serial.println(roofClosed ? "CLOSED" : "OPEN");

  Serial.print("Mode: ");
  Serial.println(autoMode ? "AUTO" : "MANUAL");
}

// =====================================================
// SEND DATA TO BLYNK
// =====================================================

void sendToBlynk()
{
  Blynk.virtualWrite(V2, temperature);
  Blynk.virtualWrite(V3, humidity);

  Blynk.virtualWrite(V4, soilValue);
  Blynk.virtualWrite(V5, rainValue);
  Blynk.virtualWrite(V6, ldrValue);

  Blynk.virtualWrite(V7, pumpState);
  Blynk.virtualWrite(V8, fanState);
  Blynk.virtualWrite(V9, lightState);

  Blynk.virtualWrite(V10, roofClosed);
  Blynk.virtualWrite(V11, autoMode);

  Blynk.virtualWrite(V12, pumpState);
  Blynk.virtualWrite(V13, fanState);
  Blynk.virtualWrite(V14, lightState);
  Blynk.virtualWrite(V15, roofClosed);
}

// =====================================================
// LCD DISPLAY
// =====================================================

void updateLCD()
{
  // Page 1

  lcdPrintLine(
    0,
    "T:" + String(temperature, 1) +
    "C H:" + String(humidity, 0) + "%"
  );

  lcdPrintLine(
    1,
    "Soil:" + String(soilValue)
  );

  delay(1500);

  // Page 2

  lcdPrintLine(
    0,
    "Rain:" + String(rainValue)
  );

  lcdPrintLine(
    1,
    "L:" + String(lightState ? "ON " : "OFF") +
    " F:" + String(fanState ? "ON " : "OFF")
  );

  delay(1500);

  // Page 3

  lcdPrintLine(
    0,
    "Pump:" + String(pumpState ? "ON " : "OFF")
  );

  lcdPrintLine(
    1,
    "Roof:" + String(roofClosed ? "CLOSED" : "OPEN")
  );
}

// =====================================================
// BLYNK CONNECTED
// =====================================================

BLYNK_CONNECTED()
{
  Serial.println("Blynk Connected!");

  Blynk.syncVirtual(V0);

  Blynk.syncVirtual(V12);
  Blynk.syncVirtual(V13);
  Blynk.syncVirtual(V14);
  Blynk.syncVirtual(V15);
}

// =====================================================
// SETUP
// =====================================================

void setup()
{
  Serial.begin(115200);

  // Relay pins
  pinMode(PUMP_RELAY, OUTPUT);
  pinMode(LIGHT_RELAY, OUTPUT);
  pinMode(FAN_RELAY, OUTPUT);

  // All relays OFF at startup
  digitalWrite(PUMP_RELAY, HIGH);
  digitalWrite(LIGHT_RELAY, HIGH);
  digitalWrite(FAN_RELAY, HIGH);

  // LDR
  pinMode(LDR_PIN, INPUT);

  // DHT
  dht.begin();

  // Servo
  roofServo.setPeriodHertz(50);

  roofServo.attach(
    SERVO_PIN,
    500,
    2400
  );

  // Start with roof open
  openRoof();

  // LCD
  lcdInit();

  lcdPrintLine(0, "SMART GREENHOUSE");
  lcdPrintLine(1, "Starting...");

  delay(2000);

  // Blynk
  Blynk.begin(
    BLYNK_AUTH_TOKEN,
    ssid,
    pass
  );

  // Timers
  timer.setInterval(2000L, readSensors);
  timer.setInterval(3000L, sendToBlynk);
  timer.setInterval(5000L, updateLCD);

  lcdClear();

  Serial.println();
  Serial.println("================================");
  Serial.println(" SMART GREENHOUSE STARTED");
  Serial.println("================================");
}

// =====================================================
// LOOP
// =====================================================

void loop()
{
  Blynk.run();
  timer.run();
}