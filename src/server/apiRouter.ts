import { RailBackendService } from "./services/railBackend";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json; charset=utf-8",
};

function jsonResponse(data: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

function errorResponse(message: string, status = 400, details?: unknown): Response {
  return jsonResponse(
    {
      error: true,
      status,
      message,
      ...(details ? { details } : {}),
      timestamp: new Date().toISOString(),
    },
    status,
  );
}

export async function handleApiRequest(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Only handle /api/ endpoints
  if (!pathname.startsWith("/api/") && pathname !== "/api") {
    return null;
  }

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const searchParams = url.searchParams;

  try {
    // 1. OpenAPI / API Docs Schema
    if (pathname === "/api" || pathname === "/api/v1" || pathname === "/api/v1/docs") {
      return jsonResponse({
        openapi: "3.0.0",
        info: {
          title: "RailDristhi Developer REST API",
          version: "1.0.0",
          description:
            "Production REST API for real-time train tracking, ETA forecasts with uncertainty intervals, delay cause classification, station boards, PNR status, and connecting train transfer risk analysis.",
        },
        servers: [{ url: "/api/v1", description: "Default v1 Gateway" }],
        endpoints: [
          { path: "/api/v1/trains", method: "GET", description: "Search trains with pagination and status filters" },
          { path: "/api/v1/train/:number/live", method: "GET", description: "Real-time GPS coordinates, speed, ETA predictions, delay reason" },
          { path: "/api/v1/train/:number/timetable", method: "GET", description: "Full halt sequence, arrival/departure schedules, coordinates" },
          { path: "/api/v1/station/:code/board", method: "GET", description: "Live station board for arrivals/departures/platforms" },
          { path: "/api/v1/stations", method: "GET", description: "Search railway stations dictionary across India" },
          { path: "/api/v1/between", method: "GET", description: "Find direct trains connecting two station codes" },
          { path: "/api/v1/control-room", method: "GET", description: "Network-wide fleet health metrics, delay cause breakdown, and alerts" },
          { path: "/api/v1/connecting-impact", method: "GET", description: "Transfer feasibility analyzer for connecting services" },
          { path: "/api/v1/pnr/:pnr", method: "GET", description: "10-digit Indian Railways PNR validation and booking status" },
        ],
      });
    }

    // 2. GET /api/v1/trains or /api/trains
    if (pathname === "/api/v1/trains" || pathname === "/api/trains") {
      const query = searchParams.get("q") ?? searchParams.get("query") ?? "";
      const type = searchParams.get("type") ?? undefined;
      const state = (searchParams.get("state") as "running" | "halted" | "on-time" | "delayed") ?? undefined;
      const from = searchParams.get("from") ?? undefined;
      const to = searchParams.get("to") ?? undefined;
      const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;
      const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!, 10) : 0;

      const result = RailBackendService.searchTrains({
        query,
        type,
        state,
        from,
        to,
        limit: Math.min(Math.max(limit, 1), 100),
        offset: Math.max(offset, 0),
      });

      return jsonResponse({
        success: true,
        ...result,
      });
    }

    // 3. GET /api/v1/train/:number/live
    const liveMatch = pathname.match(/^\/api(?:\/v1)?\/train\/([^/]+)\/live$/);
    if (liveMatch) {
      const trainNumber = decodeURIComponent(liveMatch[1]!);
      const status = RailBackendService.getTrainLiveStatus(trainNumber);
      if (!status) {
        return errorResponse(`Train with number '${trainNumber}' not found in active network.`, 404);
      }
      return jsonResponse({
        success: true,
        data: status,
      });
    }

    // 4. GET /api/v1/train/:number/timetable
    const ttMatch = pathname.match(/^\/api(?:\/v1)?\/train\/([^/]+)\/timetable$/);
    if (ttMatch) {
      const trainNumber = decodeURIComponent(ttMatch[1]!);
      const timetable = RailBackendService.getTrainTimetable(trainNumber);
      if (!timetable) {
        return errorResponse(`Train with number '${trainNumber}' not found.`, 404);
      }
      return jsonResponse({
        success: true,
        data: timetable,
      });
    }

    // 5. GET /api/v1/train/:number
    const trainMatch = pathname.match(/^\/api(?:\/v1)?\/train\/([^/]+)$/);
    if (trainMatch) {
      const trainNumber = decodeURIComponent(trainMatch[1]!);
      const live = RailBackendService.getTrainLiveStatus(trainNumber);
      const timetable = RailBackendService.getTrainTimetable(trainNumber);
      if (!live || !timetable) {
        return errorResponse(`Train with number '${trainNumber}' not found.`, 404);
      }
      return jsonResponse({
        success: true,
        data: {
          ...live.train,
          live: live.live,
          timetable: timetable.halts,
        },
      });
    }

    // 6. GET /api/v1/stations
    if (pathname === "/api/v1/stations" || pathname === "/api/stations") {
      const query = searchParams.get("q") ?? searchParams.get("query") ?? "";
      const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 30;
      const stations = RailBackendService.searchStations(query, Math.min(Math.max(limit, 1), 100));

      return jsonResponse({
        success: true,
        count: stations.length,
        stations,
      });
    }

    // 7. GET /api/v1/station/:code/board
    const boardMatch = pathname.match(/^\/api(?:\/v1)?\/station\/([^/]+)\/board$/);
    if (boardMatch) {
      const code = decodeURIComponent(boardMatch[1]!);
      const mode = (searchParams.get("mode") as "all" | "arrivals" | "departures") ?? "all";
      const board = RailBackendService.getStationBoard(code, mode);
      return jsonResponse({
        success: true,
        data: board,
      });
    }

    // 8. GET /api/v1/between
    if (pathname === "/api/v1/between" || pathname === "/api/between") {
      const from = searchParams.get("from");
      const to = searchParams.get("to");
      if (!from || !to) {
        return errorResponse("Missing required query parameters 'from' and 'to' station codes.", 400);
      }
      const result = RailBackendService.findTrainsBetween(from, to);
      return jsonResponse({
        success: true,
        data: result,
      });
    }

    // 9. GET /api/v1/control-room
    if (pathname === "/api/v1/control-room" || pathname === "/api/control-room") {
      const metrics = RailBackendService.getControlRoomMetrics();
      return jsonResponse({
        success: true,
        data: metrics,
      });
    }

    // 10. GET /api/v1/connecting-impact
    if (pathname === "/api/v1/connecting-impact" || pathname === "/api/connecting-impact") {
      const incoming = searchParams.get("incoming");
      const connecting = searchParams.get("connecting");
      const station = searchParams.get("station");

      if (!incoming || !connecting || !station) {
        return errorResponse(
          "Missing required query parameters: 'incoming' (train number), 'connecting' (train number), and 'station' (transfer station code).",
          400,
        );
      }

      const impact = RailBackendService.getConnectingImpact(incoming, connecting, station);
      if (!impact) {
        return errorResponse(
          "Could not compute transfer impact. Verify that both trains halt at the specified transfer station.",
          404,
        );
      }

      return jsonResponse({
        success: true,
        data: impact,
      });
    }

    // 11. GET /api/v1/pnr/:pnr
    const pnrMatch = pathname.match(/^\/api(?:\/v1)?\/pnr\/([^/]+)$/);
    if (pnrMatch) {
      const pnr = decodeURIComponent(pnrMatch[1]!);
      const status = RailBackendService.getPnrStatus(pnr);
      if (!status) {
        return errorResponse("Invalid PNR format. PNR must be a 10-digit numeric string.", 400);
      }
      return jsonResponse({
        success: true,
        data: status,
      });
    }

    // Unrecognized API route
    return errorResponse(`API endpoint '${pathname}' not found. Visit /api/v1/docs for available routes.`, 404);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal API error";
    return errorResponse(message, 500);
  }
}
