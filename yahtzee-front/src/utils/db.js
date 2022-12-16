import PouchDB from "pouchdb-browser";

/** @type {string|undefined} */
const dbRemote = import.meta.env.VITE_POUCH_DB;
console.log("PouchDB URL", { dbRemote });

const db = new PouchDB(dbRemote);

export { db };
