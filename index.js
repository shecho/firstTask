const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
async function init() {
  try {
    const $ = await request({
      uri: "https://en.wikipedia.org/wiki/List_of_largest_energy_companies",
      transform: (body) => cheerio.load(body),
    });
    console.log("new response");
    const table = $(".sortable").find("tr").next();

    // another way to get all data
    // console.log(table.text());
    // console.log(table.html());
    // let enterprises = [];
    // table.each((i, e) => {
    //   // console.log(i, $(e).text());
    //   enterprises.push($(e).text().split("\n"));
    // });
    // console.table(enterprises[2][2]);

    let items = [];
    table.each((i, el) => {
      const name = $(el).find("a");
      const stockName = $(el).find("small a").next();
      const country = $(el).find("span").next();

      const link = $(el).find("a");
      // console.log(link.attr("href"));
      let item = {
        name: name.html(),
        stockName: stockName.html(),
        country: country.html(),
        link: link.attr("href"),
      };
      items.push(item);
    });
    console.log(items);
    fs.writeFileSync("./data/companies.html", table.html());
    fs.writeFileSync("./data/companies.text", table.text());
    // let data = JSON.stringify(companies);
    // fs.writeFileSync("./data/companies.json", data);
  } catch (e) {
    console.log(e);
  }
}
init();
