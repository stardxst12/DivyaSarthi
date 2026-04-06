const express = require("express");
const fs = require("fs");
const path = require("path");
const JSONStream = require("JSONStream");

const router = express.Router();

const filePath = path.join(__dirname, "..", "data", "myscheme_schemes.json");
const READ_CHUNK = Number(process.env.SCHEMES_READ_CHUNK_BYTES) || 64 * 1024;

function wantsPagination(req) {
  return (
    Object.prototype.hasOwnProperty.call(req.query, "page") ||
    Object.prototype.hasOwnProperty.call(req.query, "limit")
  );
}

function parsePagination(req) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(
    200,
    Math.max(1, parseInt(req.query.limit, 10) || 50)
  );
  return { page, limit };
}

function sendPaginated(res, page, limit) {
  const skip = (page - 1) * limit;
  const items = [];
  let earlyExit = false;

  const fileStream = fs.createReadStream(filePath, {
    encoding: "utf8",
    highWaterMark: READ_CHUNK,
  });
  const parser = JSONStream.parse("*");

  let finalized = false;
  const fail = () => {
    if (finalized || res.headersSent) return;
    finalized = true;
    res.status(500).json({ error: "Failed to read scheme data" });
  };

  fileStream.on("error", fail);
  parser.on("error", fail);

  let seen = 0;
  parser.on("data", (item) => {
    if (seen >= skip && items.length < limit) {
      items.push(item);
    }
    seen += 1;
    if (items.length >= limit) {
      earlyExit = true;
      fileStream.destroy();
    }
  });

  function finalize() {
    if (finalized || res.headersSent) return;
    finalized = true;
    res.json({
      data: items,
      page,
      limit,
      hasMore: earlyExit,
    });
  }

  parser.on("end", finalize);
  parser.on("close", finalize);

  fileStream.pipe(parser);
}

function streamJsonArray(res) {
  res.status(200);
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  const fileStream = fs.createReadStream(filePath, {
    encoding: "utf8",
    highWaterMark: READ_CHUNK,
  });
  const parser = JSONStream.parse("*");

  let first = true;
  let destroyed = false;

  const cleanup = (err) => {
    if (destroyed) return;
    destroyed = true;
    if (err && !res.headersSent) {
      res.status(500).end();
      return;
    }
    if (err && res.writableEnded === false) {
      res.destroy();
    }
  };

  fileStream.on("error", (e) => cleanup(e));
  parser.on("error", (e) => cleanup(e));

  res.write("[");

  parser.on("data", (item) => {
    const chunk = first ? JSON.stringify(item) : `,${JSON.stringify(item)}`;
    first = false;
    if (!res.write(chunk)) {
      fileStream.pause();
      res.once("drain", () => fileStream.resume());
    }
  });

  parser.on("end", () => {
    if (destroyed) return;
    res.write("]");
    res.end();
  });

  fileStream.pipe(parser);
}

router.get("/schemes", (req, res) => {
  if (wantsPagination(req)) {
    const { page, limit } = parsePagination(req);
    return sendPaginated(res, page, limit);
  }
  return streamJsonArray(res);
});

module.exports = router;
