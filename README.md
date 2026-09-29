# 🌱 Smart Greenhouse Monitoring System

An **ESP32-based Smart Greenhouse Monitoring and Control System** designed to automatically monitor environmental conditions and control essential greenhouse operations such as irrigation, ventilation, lighting, and roof movement.

The system uses multiple sensors to collect real-time environmental data and applies predefined conditions to automatically control different actuators.

---

## 📌 Project Overview

The **Smart Greenhouse Monitoring System** is a low-cost embedded system developed using an **ESP32 DevKit**.

It monitors:

* 🌡️ Temperature
* 💧 Humidity
* 🌱 Soil Moisture
* 💡 Light Intensity
* 🌧️ Rain Detection

Based on these environmental conditions, the system automatically controls:

* 💦 Water Pump for irrigation
* 🌀 DC Fan for ventilation
* 💡 12V Light for additional lighting
* 🏠 SG90 Servo Motor for greenhouse roof movement

A **16×2 I2C LCD** is also used to display system information locally.

---

## 🎯 Objectives

* Continuously monitor greenhouse temperature and humidity.
* Detect soil moisture conditions for automatic irrigation.
* Automatically activate the water pump when the soil becomes dry.
* Activate the fan when the temperature exceeds the selected threshold.
* Detect insufficient natural light and control the 12V light.
* Detect rainfall and automatically control the greenhouse roof.
* Display sensor and system information through an I2C LCD.
* Reduce unnecessary water and electricity consumption.
* Demonstrate practical applications of microcontrollers and automation.

---

## 🧰 Hardware Components

| Component                  | Purpose                           |
| -------------------------- | --------------------------------- |
| ESP32 DevKit               | Main controller                   |
| DHT22                      | Temperature & humidity monitoring |
| Soil Moisture Sensor       | Soil condition monitoring         |
| LDR Module                 | Light intensity detection         |
| MH-RD Rain Sensor          | Rain detection                    |
| 1-Channel Relay Modules ×3 | Switching pump, fan and light     |
| 12V DC Water Pump          | Automatic irrigation              |
| 12V DC Fan                 | Ventilation                       |
| 12V Light                  | Additional lighting               |
| SG90 Servo Motor           | Automatic roof movement           |
| 16×2 I2C LCD               | Local system display              |
| LM2596 Buck Converter      | Voltage regulation                |
| 12V 5A Adapter             | Main power supply                 |
| Breadboard & Jumper Wires  | Circuit connections               |

---

## ⚙️ How It Works

The ESP32 continuously receives data from the connected sensors and compares the readings with predefined conditions.

### 🌱 Automatic Irrigation

When the soil becomes dry:

**Soil Moisture Sensor → ESP32 → Relay → Water Pump ON**

The pump stops when sufficient soil moisture is restored.

### 🌡️ Automatic Ventilation

When the temperature rises above the selected threshold:

**DHT22 → ESP32 → Relay → Fan ON**

The fan turns off when the temperature returns to an acceptable level.

### 💡 Automatic Lighting

The LDR monitors available natural light.

When the light level becomes insufficient:

**LDR → ESP32 → Relay → 12V Light ON**

### 🌧️ Automatic Roof Control

The rain sensor detects rainfall.

When rain is detected:

**Rain Sensor → ESP32 → SG90 Servo → Roof CLOSED**

When rain is no longer detected, the roof can return to its normal position.

### 📟 LCD Monitoring

The 16×2 I2C LCD displays relevant system information and status during operation.

---

## 🔄 System Workflow

```text
                ┌──────────────────┐
                │     ESP32        │
                │ Main Controller  │
                └────────┬─────────┘
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼
    Sensors          Processing         Outputs
       │                 │                 │
       │                 │        ┌────────┼────────┐
       │                 │        │        │        │
       ▼                 ▼        ▼        ▼        ▼
    DHT22            Threshold   Pump     Fan     Light
 Soil Moisture       Logic
    LDR
 Rain Sensor                            SG90 Servo
                                         │
                                         ▼
                                  Automatic Roof
```

---

## 🧪 Testing

The system can be tested under different environmental conditions.

| Condition                | Expected Response               |
| ------------------------ | ------------------------------- |
| Dry soil                 | Water pump activates            |
| Sufficient soil moisture | Water pump stops                |
| High temperature         | Fan activates                   |
| Normal temperature       | Fan stops                       |
| Low light                | 12V light activates             |
| Sufficient light         | Light turns off                 |
| Rain detected            | Roof closes                     |
| No rain                  | Roof returns to normal position |
| System operation         | LCD displays system information |

---

## 💰 Project Budget

The implemented prototype has an approximate total cost of:

### **BDT 4,000**

| Category                         |          Cost |
| -------------------------------- | ------------: |
| Electronic Components            |     BDT 2,830 |
| Greenhouse Structure & Materials |     BDT 1,170 |
| **Total**                        | **BDT 4,000** |

---

## 🌱 Sustainability

The system aims to reduce unnecessary resource consumption through automated control.

* Automatic irrigation can reduce unnecessary water usage.
* The fan operates according to temperature conditions.
* The light operates according to available natural light.
* Modular components can be replaced individually.
* Future solar-power integration can reduce dependence on conventional electricity.
* Proper reuse and disposal of electronic components can help reduce e-waste.

---

## ⚠️ Safety Considerations

* Keep electronic components away from water.
* Use insulated wires and secure electrical connections.
* Use the correctly rated power adapter.
* Keep water pipes separated from electronic circuits.
* Protect relay-controlled loads.
* Calibrate sensors before operation.
* Disconnect power before modifying the circuit.
* Ensure the moving roof mechanism is safe.

---

## 🚧 Limitations

* The current system is a small laboratory prototype.
* Low-cost sensors may have limited accuracy.
* The SG90 servo is suitable only for a lightweight roof.
* The system depends on a stable power supply.
* Long-term environmental data is not currently stored.
* The current prototype does not include a web or mobile dashboard.

---

## 🚀 Future Improvements

Possible future improvements include:

* 📱 Wi-Fi-based mobile/web dashboard
* ☁️ Cloud data storage
* ☀️ Solar power integration
* 🔋 Rechargeable battery backup
* 🧪 pH and nutrient sensors
* 🌫️ CO₂ monitoring
* 💧 Water-level monitoring
* 🔔 Notification and alert system
* 📊 Graphical environmental reports
* 🏠 Stronger roof motor mechanism
* 🎛️ Manual override control
* 🌱 Multiple greenhouse zone support

---

## 💻 Software & Tools

* **Arduino IDE**
* **ESP32**
* **Embedded C/C++**
* Sensor libraries
* I2C communication

---

## 📂 Suggested Repository Structure

```text
Smart-Greenhouse/
│
├── README.md
├── src/
│   └── smart_greenhouse.ino
│
├── circuit/
│   └── circuit-diagram.png
│
├── images/
│   ├── prototype.jpg
│   ├── circuit.jpg
│   └── system-diagram.png
│
├── docs/
│   └── project-report.pdf
│
└── LICENSE
```

---

## 👩‍💻 Team Members

### Ahona Zabin

CSE, Ahsanullah University of Science and Technology

### Fahmida Afrin Nadia

CSE, Ahsanullah University of Science and Technology

### Afifa Faija

CSE, Ahsanullah University of Science and Technology

### Afra Anan

CSE, Ahsanullah University of Science and Technology

**Course:** CSE 3118 – Microprocessors and Microcontrollers Lab

---

## 📚 Project Keywords

`ESP32` `Smart Greenhouse` `IoT` `Embedded Systems` `Smart Agriculture` `Arduino` `Automation` `DHT22` `Soil Moisture` `LDR` `Rain Detection` `Relay Control` `Irrigation` `Microcontroller`

---

## 📄 Project Report

The complete project report contains the system architecture, working procedure, hardware components, testing plan, budget analysis, sustainability considerations, safety measures, limitations, and future development plans.

---

## ⭐ Project Goal

The main goal of this project is to demonstrate how **microcontrollers, sensors, automation, and actuator control** can be integrated to create an affordable smart-agriculture prototype.

> **Sense → Process → Decide → Act → Monitor**

