let pollCounter = 0;

export function getPollingSnapshot(_req, res) {
  pollCounter += 1;
  res.json({
    source: 'polling',
    sequence: pollCounter,
    cpuPercent: 22 + (pollCounter % 9) * 3,
    queueDepth: 5 + (pollCounter % 6),
    generatedAt: new Date().toISOString(),
  });
}

export function streamEvents(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let eventCounter = 0;
  const sendEvent = () => {
    eventCounter += 1;
    const payload = {
      id: eventCounter,
      level: eventCounter % 5 === 0 ? 'warning' : 'info',
      message:
        eventCounter % 5 === 0
          ? 'SSE: queue spike detected'
          : 'SSE: background sync completed',
      at: new Date().toISOString(),
    };
    res.write(`event: telemetry\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  // Give immediate feedback in UI right after connection.
  sendEvent();
  const timer = setInterval(sendEvent, 3000);

  req.on('close', () => {
    clearInterval(timer);
  });
}
