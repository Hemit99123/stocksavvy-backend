export const getHTMLTemplate = (random4DigitNumber: string) => {
  return `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
              }
              .email-container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #ffffff;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #ddd;
              }
              .header h1 {
                margin: 0;
                color: #286A4D; /* Updated color */
              }
              .otp {
                font-size: 24px;
                font-weight: bold;
                color: #286A4D; /* Updated color */
                text-align: center;
                margin: 20px 0;
              }
              .footer {
                font-size: 14px;
                color: #666;
                text-align: center;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>StockSavvy</h1>
              </div>
              <p>Hello,</p>
              <p>Use the following One-Time Password (OTP) to complete your verification process:</p>
              <div class="otp">${random4DigitNumber}</div>
              <p>This OTP is only valid for 3 minutes.</p>
              <div class="footer">
                <p>If you did not request this, please ignore this email.</p>
              </div>
            </div>
          </body>
          </html>
        `
}
