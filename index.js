const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

let items = [];
// main program
(async () => {
  try {
    const $ = await request({
      uri: "https://en.wikipedia.org/wiki/List_of_largest_energy_companies",
      transform: (body) => cheerio.load(body),
    });
    const table = $(".sortable").find("tr").next();

    table.each(async (i, el) => {
      const name = $(el).find("a");
      const stockName = $(el).find("small a").next();
      const country = $(el).find("span").next();
      const link = $(el).find("a");
      let uri = link.attr("href");
      let fullUri = `https://en.wikipedia.org${uri}`;
      let year = await getYear(fullUri);
      await setItem(name, stockName, country, link, year);
      let data = JSON.stringify(items, null, 2);
      fs.writeFileSync("./data/companies.json", data);
    });

    let data = JSON.stringify(items, null, 2);
    fs.writeFileSync("./data/companies.json", data);
  } catch (e) {
    console.log(e);
  }
})();

const getYear = async (uri) => {
  const $$ = await request({
    uri: uri,
    transform: (body) => cheerio.load(body),
  });
  let year = $$(".infobox").find(".noprint").text();
  let yearSplited = year.split(";");
  return yearSplited[1];
};

const setItem = async (name, stockName, country, link, year) => {
  let item = {
    name: name.html(),
    stockName: stockName.html(),
    country: country.html(),
    link: link.attr("href"),
    year: year,
  };
  items.push(item);
  return item;
};
