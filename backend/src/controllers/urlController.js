const bcrypt = require("bcrypt");
const QRCode = require("qrcode");
const Url = require("../models/Url");
const ClickLog = require("../models/ClickLog");

async function createShortUrl(req, res) {
  try {
    const { originalUrl, password } = req.body || {};

    if (typeof originalUrl !== "string" || originalUrl.trim() === "") {
      return res.status(400).json({
        message: "originalUrl is required",
      });
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(originalUrl.trim());
    } catch {
      return res.status(400).json({
        message: "Please provide a valid URL",
      });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        message: "URL must start with http:// or https://",
      });
    }

    if (
      password !== undefined &&
      password !== null &&
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "password must be a string",
      });
    }

    // nanoid v6 เป็น ES Module ส่วนโปรเจกต์นี้ใช้ CommonJS
    const { nanoid } = await import("nanoid");
    const shortCode = nanoid(6);

    let passwordHash = null;

    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const url = await Url.create({
      originalUrl: parsedUrl.toString(),
      shortCode,
      passwordHash,
    });

    const baseUrl = process.env.BASE_URL.replace(/\/$/, "");
    const shortUrl = `${baseUrl}/${url.shortCode}`;
    const qrCode = await QRCode.toDataURL(shortUrl);

    return res.status(201).json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl,
      qrCode,
      createdAt: url.createdAt,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);

    return res.status(500).json({
      message: "Unable to create short URL",
    });
  }
}

async function accessShortUrl(req, res) {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        message: "Short URL not found",
      });
    }

    if (url.passwordHash) {
      const frontendUrl = process.env.FRONTEND_URL.replace(/\/$/, "");

      return res.redirect(
        `${frontendUrl}/?passwordCode=${encodeURIComponent(url.shortCode)}`,
      );
    }

    await ClickLog.create({ urlId: url._id });

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Error accessing short URL:", error);

    return res.status(500).json({
      message: "Unable to access short URL",
    });
  }
}

async function verifyShortUrlPassword(req, res) {
  try {
    const { shortCode } = req.params;
    const { password } = req.body || {};

    if (typeof password !== "string" || password.length === 0) {
      return res.status(400).json({
        message: "password is required",
      });
    }

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        message: "Short URL not found",
      });
    }

    if (!url.passwordHash) {
      return res.status(400).json({
        message: "This short URL does not require a password",
      });
    }

    const passwordIsCorrect = await bcrypt.compare(password, url.passwordHash);

    if (!passwordIsCorrect) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    await ClickLog.create({ urlId: url._id });

    return res.status(200).json({
      redirectUrl: url.originalUrl,
    });
  } catch (error) {
    console.error("Error verifying short URL password:", error);

    return res.status(500).json({
      message: "Unable to verify password",
    });
  }
}

async function getUrlHistory(req, res) {
  try {
    const baseUrl = process.env.BASE_URL.replace(/\/$/, "");

    const history = await Url.aggregate([
      {
        $sort: {
          createdAt: -1,
          _id: -1,
        },
      },
      {
        $lookup: {
          from: "CLICK_LOGS",
          localField: "_id",
          foreignField: "urlId",
          as: "clickLogs",
        },
      },
      {
        $project: {
          originalUrl: 1,
          shortCode: 1,
          shortUrl: { $concat: [baseUrl, "/", "$shortCode"] },
          createdAt: 1,
          clickCount: { $size: "$clickLogs" },
        },
      },
    ]);

    const historyWithQrCodes = await Promise.all(
      history.map(async (url) => ({
        ...url,
        qrCode: await QRCode.toDataURL(url.shortUrl),
      })),
    );

    return res.status(200).json(historyWithQrCodes);
  } catch (error) {
    console.error("Error getting URL history:", error);

    return res.status(500).json({
      message: "Unable to get URL history",
    });
  }
}

module.exports = {
  createShortUrl,
  accessShortUrl,
  verifyShortUrlPassword,
  getUrlHistory,
};
