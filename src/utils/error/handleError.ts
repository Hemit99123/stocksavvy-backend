import type { Response } from "express";

// Implemented this helper function to adhere to the DRY (Do not repeat yourself) rule as this code was being overused many times in my logic/code!

const handleError = (res: Response, error: unknown) => {
  if (error instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  } else {
    return res.status(500).json({
      message: "Unknown Internal Server Error",
    });
  }
};

export default handleError;
