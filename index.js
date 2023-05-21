const ejs = require("ejs");
const puppeteer = require("puppeteer");
const path = require("path");

const data = {
  title: "Hello World",
  content: "Hello World",
  description: "This is a description",
};

const generatePdf = () => {
  const templateFile = path.resolve(__dirname, "./template.ejs");
  ejs.renderFile(templateFile, data, async function (err, html) {
    if (err) {
      console.log(err);
    }

    const browser = await puppeteer.launch({
      headless: true,
    });
    const headerTemplate = `
    <style>#header, #footer { padding: 0 !important; }</style>
  <div class="header" style="padding: 0 !important; margin: 0; -webkit-print-color-adjust: exact; background-color: red; color: white; width: 100%; text-align: left; font-size: 12px;"">
    This is a PDF header 3
  </div>
`;
    const footerTemplate = `
  <div style="font-size:16px; line-height:24px;">
    <p>This is a PDF footer</p>
  </div>
`;
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({
      path: "./output.pdf",
      format: "A4",
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
      margin: {
        top: "150px",
        bottom: "150px",
        left: "16px",
        right: "16px",
      },
    });
    await browser.close();
  });
};

generatePdf();
