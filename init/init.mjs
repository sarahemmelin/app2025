import { Node, Tree, saveTree } from '../data/tree.mjs';

//#Region DUMMY data -------------------------

const a1 = Node("A1");
const a2 = Node("A2");
const a = Node("A", a1, a2);

const b1 = Node("B1");
const b2 = Node("B2");
const b = Node("B", b1, b2);

const root = Node("data", a,b);
const tree = Tree(root);

//#endregion

console.log(saveTree(root));

// start server -----------------------------
// const server = await import ("../server.mjs");

