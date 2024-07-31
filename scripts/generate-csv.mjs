import * as csv from "csv";
import fs from "fs/promises";
import { promisify } from "util";
import { faker } from "@faker-js/faker";

const NUM_ROWS = 2000;
const EVENT_NAMES = ["Product Added", "Product Clicked"];
const EVENT_TYPES = ["click", "conversion"];
// User session token - guilherme.paiva@goodeggs.com
const USER_ID = process.env.USER_ID;
/**
 * Bakery > Bread
 * https://www.goodeggs.com/daveskillerbreadsfbay/organic-21-whole-grains-seeds-bread/572cea8084704003005fd127
 * https://www.goodeggs.com/daveskillerbreadsfbay/organic-good-seed-bread/572ceb0289f56b0300844712
 * https://www.goodeggs.com/inkedorganics/organic-san-francisco-sourdough-bread/5ebdf82d653e4b000e300b38
 * https://www.goodeggs.com/alvaradostreetbakery/sprouted-sourdough-bread/559c6b98f42a3d0300003b8c
 * https://www.goodeggs.com/briochepasquiersfbay/sliced-brioche-loaf/5ef6616c99afb6000e0bba93
 * https://www.goodeggs.com/daveskillerbreadsfbay/organic-white-done-right-bread/572ceb01c728db03002f5cc4
 */
const ALGOLIA_PRODUCT_IDS = [
	"572cea8084704003005fd127",
	"572ceb0289f56b0300844712",
	"5ebdf82d653e4b000e300b38",
	"559c6b98f42a3d0300003b8c",
	"5ef6616c99afb6000e0bba93",
	"572ceb01c728db03002f5cc4",
];

function generateAlgoliaEvents() {
	const headerColumns = [
		"userToken",
		"timestamp",
		"objectID",
		"eventType",
		"eventName",
	];

	// Adds the header columns
	const rows = [];
	rows.push(headerColumns);
	// Adds the rows
	for (let i = 0; i < NUM_ROWS; i++) {
		const eventType = faker.helpers.arrayElement(EVENT_TYPES);
		const eventName = faker.helpers.arrayElement(EVENT_NAMES);
		const objectID = faker.helpers.arrayElement(ALGOLIA_PRODUCT_IDS);
		const timestamp = faker.date.recent({ days: 30, refDate: new Date() });

		rows.push([USER_ID, timestamp.getTime(), objectID, eventType, eventName]);
	}
	return rows;
}

async function main() {
	const algoliaEventsJSON = generateAlgoliaEvents();
	const stringifiedOutput = await promisify(csv.stringify)(algoliaEventsJSON);
	try {
		await fs.readdir("./output");
	} catch {
		await fs.mkdir("./output", { recursive: true });
	}
	await fs.writeFile("./output/events.csv", stringifiedOutput, "utf8");

	return stringifiedOutput;
}

main().then(console.info).catch(console.error);
