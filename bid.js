const inquirer = require("inquirer");
// connecting db
const mysql = require("mysql2");
const conn = mysql.createConnection(
  "mysql://root:fiko1234@localhost:3306/ebay"
);
const pool = conn.promise();
//inquirer
function ask() {
  inquirer
    .prompt([
      {
        name: "mehsul",
        message: "ne isteyirsen",
        type: "list",
        choices: ["satmaq", "almaq"],
      },
    ])
    .then((choice) => {
      if (choice.mehsul == "satmaq") {
        addDb();
      } else if (choice.mehsul == "almaq") {
        delDb();
      }
    });
}
function run() {
  ask();
}
function addDb() {
  inquirer
    .prompt([
      {
        name: "mehsul",
        message: "mehsulu elave et",
        type: "input",
      },
      {
        name: "kateqoriya",
        message: "kateqoriya elave et",
        type: "input",
      },
    ])
    .then((result) => add(result.mehsul, result.kateqoriya, 100));
}
async function add(mehsul, kateqoriya) {
  const result = await pool.query(`
      insert into auctions(item_name,category, starting_bid) values('${mehsul}','${kateqoriya}','${100}') `);
      console.log('elave olundu')
  run();
}

async function delDb() {
  await list();
  inquirer
    .prompt([
      {
        name: "id",
        message: "id-ni elave et",
        type: "input",
      },
      {
        name: "bid",
        message: "bidi elave et",
        type: "input",
      },
    ])
    .then((result) => del(parseInt(result.id), parseInt(result.bid)));
}

async function del(id, bid) {
  const result = await pool.query(`
        select * from auctions where id=${id}`);
  const product = result[0];
  if (product[0]["starting_bid"] >= bid) {
    console.log("😞 teklif asagidi:::",bid);
    run();
  } else {
    console.log("🤗 teklif qebul olundu:::", bid);
    const ansr = await pool.query(`
            update auctions set highest_bid = ${bid} where id = ${id} ;
            `);
            run();

  }
}

async function list() {
  const result = await pool.query(`
        select * from auctions `);
  console.log(result[0]);
  return result[0];
}

run();
