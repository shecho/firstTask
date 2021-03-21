const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

// main program
(async () => {
  try {
    const $ = await request({
      uri: "https://en.wikipedia.org/wiki/List_of_largest_energy_companies",
      transform: (body) => cheerio.load(body),
    });
    const table = $(".sortable").find("tr").next();

    let items = [];
    table.each(async (i, el) => {
      const name = $(el).find("a");
      const stockName = $(el).find("small a").next();
      const country = $(el).find("span").next();
      const link = $(el).find("a");
      // let uri = link.attr("href");
      // let fullUri = `https://en.wikipedia.org${uri}`;
      // let year = await getYear(fullUri);
      // console.log(year);
      let item = setItem(name, stockName, country, link);
      items.push(item);
    });

    console.log("line 48", items);

    fs.writeFileSync("./data/companies.html", table.html());
    fs.writeFileSync("./data/companies.text", table.text());
    // let data = JSON.stringify(companies);
    // fs.writeFileSync("./data/companies.json", data);
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
  return year;
};

const setItem = (name, stockName, country, link) => {
  let item = {
    name: name.html(),
    stockName: stockName.html(),
    country: country.html(),
    link: link.attr("href"),
  };
  return item;
};
