# 📡 RailSaarthi (RailDristhi) — REST API Documentation

RailSaarthi provides a production-ready, ultra-fast **OpenAPI 3.0-compliant REST API** for integrating real-time train tracking, ETA forecasts, delay root-cause analysis, station boards, PNR status, and connecting train transfer risk analysis into mobile apps, IoT station displays, or third-party travel platforms.

---

## 🚀 Base URL & Endpoints Overview

- **Base URL**: `http://localhost:3000/api/v1` (or your production deployment domain `/api/v1`)
- **Interactive Sandbox**: Visit `/developer` in the web application for an interactive live playground.
- **CORS**: Fully enabled (`Access-Control-Allow-Origin: *`)
- **Format**: `application/json; charset=utf-8`

| HTTP Method | Endpoint Path | Description |
|:---|:---|:---|
| `GET` | `/api/v1/docs` | OpenAPI 3.0 specification & schema |
| `GET` | `/api/v1/health` | Service health check and uptime telemetry |
| `GET` | `/api/v1/trains` | Search and filter train directory |
| `GET` | `/api/v1/train/:number/live` | Live GPS coordinates, speed, and predicted ETA |
| `GET` | `/api/v1/train/:number/timetable` | Complete scheduled halt list & route coordinates |
| `GET` | `/api/v1/station/:code/board` | Live station arrival/departure electronic board |
| `GET` | `/api/v1/stations` | Query station dictionary across India |
| `GET` | `/api/v1/between` | Find direct trains connecting two station codes |
| `GET` | `/api/v1/pnr/:pnr` | Retrieve booking status, coach layout, and live journey state |
| `GET` | `/api/v1/connecting-impact` | Connecting train transfer feasibility and miss risk |
| `GET` | `/api/v1/control-room` | Pan-India fleet metrics, zonal breakdown, and bottleneck alerts |

---

## 📖 Detailed Endpoint Reference

### 1. Search Trains (`GET /api/v1/trains`)

Query and filter trains by name, number, service class, or running state.

#### Query Parameters:
- `q` *(string, optional)*: Search term matching train number, name, or halt code (e.g. `12951` or `Rajdhani` or `NDLS`).
- `type` *(string, optional)*: Filter by type (`all`, `Rajdhani`, `Shatabdi`, `Vande Bharat`, `Superfast`, `Express`).
- `state` *(string, optional)*: Filter by running state (`running`, `halted`, `on-time`, `delayed`).
- `from` *(string, optional)*: Origin station code (e.g. `MMCT`).
- `to` *(string, optional)*: Destination station code (e.g. `NDLS`).
- `limit` *(integer, optional, default: 20)*: Maximum items to return.
- `offset` *(integer, optional, default: 0)*: Pagination offset.

#### Example Request:
```bash
curl -X GET "http://localhost:3000/api/v1/trains?q=Rajdhani&limit=2"
```

#### Example Response:
```json
{
  "total": 1,
  "limit": 2,
  "offset": 0,
  "data": [
    {
      "number": "12951",
      "name": "Mumbai Rajdhani Express",
      "type": "Rajdhani",
      "from": { "code": "MMCT", "name": "Mumbai Central" },
      "to": { "code": "NDLS", "name": "New Delhi" },
      "startsAt": "16:35",
      "totalKm": 1384,
      "haltCount": 8,
      "liveState": {
        "status": "running",
        "speed": 118,
        "delayMinutes": 14,
        "delayReason": "congestion",
        "currentStation": { "code": "KOTA", "name": "Kota Junction" },
        "nextStation": { "code": "SWM", "name": "Sawai Madhopur" },
        "predictedEta": "03:42",
        "etaConfidence": 0.88
      }
    }
  ]
}
```

---

### 2. Live Train Status & ETA (`GET /api/v1/train/:number/live`)

Get real-time spatial kinematics, GPS coordinates, current speed, next halt, model-forecasted ETA with confidence windows, and delay root-cause.

#### Path Parameters:
- `number` *(string, required)*: 5-digit Indian Railways train number (e.g. `12951`).

#### Example Request:
```bash
curl -X GET "http://localhost:3000/api/v1/train/12951/live"
```

#### Example Response:
```json
{
  "trainNumber": "12951",
  "trainName": "Mumbai Central - New Delhi Rajdhani Express",
  "type": "Rajdhani",
  "speedKmph": 118,
  "isHalted": false,
  "currentDelayMinutes": 14,
  "predictedDelayShiftMin": 18.5,
  "delayReason": "congestion",
  "delayReasonLabel": "Corridor Congestion",
  "lastHalt": {
    "code": "KOTA",
    "name": "Kota Junction",
    "departedAt": "02:20",
    "delayAtDeparture": 12
  },
  "nextHalt": {
    "code": "SWM",
    "name": "Sawai Madhopur Junction",
    "scheduledArrival": "03:25",
    "predictedArrival": "03:42",
    "predictedDelayMinutes": 17,
    "confidenceScore": 0.88,
    "confidenceWindow": {
      "lower": "03:32",
      "upper": "03:52"
    }
  },
  "coordinates": {
    "latitude": 25.5412,
    "longitude": 76.1284,
    "bearing": 34.2
  },
  "totalProgressPercent": 66.8,
  "timestamp": "2026-09-05T09:12:44.120Z"
}
```

---

### 3. Train Timetable (`GET /api/v1/train/:number/timetable`)

Retrieve the full sequence of scheduled halts, arrival/departure timings, day count, cumulative kilometers, and geo-coordinates.

#### Path Parameters:
- `number` *(string, required)*: Train number (e.g. `12951`).

#### Example Request:
```bash
curl -X GET "http://localhost:3000/api/v1/train/12951/timetable"
```

#### Example Response:
```json
{
  "trainNumber": "12951",
  "trainName": "Mumbai Rajdhani Express",
  "from": "MMCT",
  "to": "NDLS",
  "halts": [
    { "index": 0, "code": "MMCT", "name": "Mumbai Central", "arr": "16:35", "dep": "16:35", "day": 1, "km": 0, "lat": 18.9696, "lng": 72.8193 },
    { "index": 1, "code": "BVI", "name": "Borivali", "arr": "17:03", "dep": "17:05", "day": 1, "km": 30, "lat": 19.2288, "lng": 72.8569 },
    { "index": 2, "code": "ST", "name": "Surat", "arr": "19:22", "dep": "19:25", "day": 1, "km": 263, "lat": 21.2049, "lng": 72.8406 },
    { "index": 3, "code": "BRC", "name": "Vadodara Junction", "arr": "20:48", "dep": "20:58", "day": 1, "km": 392, "lat": 22.3106, "lng": 73.1812 },
    { "index": 4, "code": "RTM", "name": "Ratlam Junction", "arr": "00:25", "dep": "00:28", "day": 2, "km": 653, "lat": 23.3364, "lng": 75.0374 },
    { "index": 5, "code": "KOTA", "name": "Kota Junction", "arr": "03:15", "dep": "03:20", "day": 2, "km": 920, "lat": 25.2138, "lng": 75.8648 },
    { "index": 6, "code": "SWM", "name": "Sawai Madhopur", "arr": "04:38", "dep": "04:40", "day": 2, "km": 1028, "lat": 25.9928, "lng": 76.3533 },
    { "index": 7, "code": "NDLS", "name": "New Delhi", "arr": "08:32", "dep": "08:32", "day": 2, "km": 1384, "lat": 28.6415, "lng": 77.2197 }
  ]
}
```

---

### 4. Live Station Board (`GET /api/v1/station/:code/board`)

Electronic arrivals and departures display board for any station in India.

#### Path Parameters:
- `code` *(string, required)*: IR Station Code (e.g. `NDLS`, `HWH`, `MAS`, `CSMT`).

#### Query Parameters:
- `mode` *(string, optional, default: `all`)*: Filter by `arrivals`, `departures`, or `all`.

#### Example Request:
```bash
curl -X GET "http://localhost:3000/api/v1/station/NDLS/board?mode=arrivals"
```

#### Example Response:
```json
{
  "stationCode": "NDLS",
  "stationName": "New Delhi Railway Station",
  "zone": "NR",
  "currentTime": "07:45",
  "services": [
    {
      "trainNumber": "12951",
      "trainName": "Mumbai Rajdhani Express",
      "origin": "MMCT",
      "scheduledTime": "08:32",
      "predictedTime": "08:46",
      "delayMinutes": 14,
      "status": "Delayed",
      "platform": "1",
      "type": "Arrival"
    }
  ]
}
```

---

### 5. Smart PNR Intelligence (`GET /api/v1/pnr/:pnr`)

Retrieve passenger booking and current status, coach positioning, berth allocation, and real-time train journey progress.

#### Path Parameters:
- `pnr` *(string, required)*: 10-digit PNR number (e.g. `4523891024`).

#### Example Request:
```bash
curl -X GET "http://localhost:3000/api/v1/pnr/4523891024"
```

#### Example Response:
```json
{
  "pnr": "4523891024",
  "trainNumber": "12951",
  "trainName": "Mumbai Central - New Delhi Rajdhani Express",
  "fromStation": { "code": "MMCT", "name": "Mumbai Central" },
  "toStation": { "code": "NDLS", "name": "New Delhi" },
  "boardingStation": { "code": "MMCT", "name": "Mumbai Central" },
  "journeyDate": "2026-09-06",
  "bookingClass": "3A",
  "quota": "GN",
  "chartStatus": "CHART PREPARED",
  "passengers": [
    {
      "number": 1,
      "bookingStatus": "CNF",
      "currentStatus": "CNF",
      "coach": "B4",
      "berth": 21,
      "berthType": "Lower"
    },
    {
      "number": 2,
      "bookingStatus": "CNF",
      "currentStatus": "CNF",
      "coach": "B4",
      "berth": 22,
      "berthType": "Middle"
    }
  ],
  "fare": 4380,
  "liveStatus": {
    "speed": 118,
    "delay": 14,
    "nextStation": "Sawai Madhopur Junction",
    "eta": "03:42"
  }
}
```

---

### 6. Connecting Train Transfer Risk Analyzer (`GET /api/v1/connecting-impact`)

Predict whether a passenger will successfully transfer between two trains at an intermediate junction given live delays and platform transfer buffers.

#### Query Parameters:
- `train1` *(string, required)*: Incoming train number (e.g. `12951`).
- `train2` *(string, required)*: Connecting outgoing train number (e.g. `12431`).
- `station` *(string, required)*: Transfer junction station code (e.g. `NDLS` or `KOTA`).

#### Example Request:
```bash
curl -X GET "http://localhost:3000/api/v1/connecting-impact?train1=12951&train2=12004&station=NDLS"
```

#### Example Response:
```json
{
  "transferStation": { "code": "NDLS", "name": "New Delhi" },
  "incomingTrain": {
    "number": "12951",
    "name": "Mumbai Rajdhani Express",
    "scheduledArrival": "08:32",
    "predictedArrival": "08:46",
    "delayMinutes": 14,
    "confidence": 0.88,
    "forecastWindow": { "lower": "08:36", "upper": "08:56" }
  },
  "connectingTrain": {
    "number": "12004",
    "name": "Lucknow Shatabdi Express",
    "scheduledDeparture": "06:10",
    "platform": "12"
  },
  "bufferMinutes": 45,
  "effectiveBufferMinutes": 31,
  "transferFeasibility": "SAFE",
  "riskScorePercent": 18,
  "recommendation": "Adequate transfer time. Proceed to Foot Over Bridge 2 towards Platform 12 upon arrival.",
  "alternativeTrains": [
    {
      "number": "12420",
      "name": "Gomti Express",
      "departure": "12:20",
      "availableSeatsEstimated": 42
    }
  ]
}
```

---

### 7. Control Room Fleet Intelligence (`GET /api/v1/control-room`)

Get network-wide operational health telemetry, on-time performance (OTP), delay causes breakdown, and high-risk bottleneck trains.

#### Example Request:
```bash
curl -X GET "http://localhost:3000/api/v1/control-room"
```

#### Example Response:
```json
{
  "timestamp": "2026-09-05T09:12:44.120Z",
  "activeFleetCount": 12480,
  "monitoredRoutes": 105,
  "onTimePerformancePercent": 84.6,
  "averageFleetDelayMinutes": 16.4,
  "delayReasonBreakdown": {
    "weather": 18.2,
    "congestion": 41.5,
    "track-work": 14.1,
    "signal-failure": 9.3,
    "technical": 11.2,
    "unknown": 5.7
  },
  "criticalAlertsCount": 6,
  "criticalTrains": [
    {
      "number": "12301",
      "name": "Howrah Rajdhani Express",
      "delayMinutes": 82,
      "reason": "track-work",
      "zone": "ER",
      "action": "Caution order in ASN division. Prioritize loop clearance."
    }
  ]
}
```
