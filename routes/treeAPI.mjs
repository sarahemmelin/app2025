import express from 'express';
import { Tree, Node } from '../data/tree.mjs';

const treeRouter = express.Router();
treeRouter.use(express.json());

const tree = Tree(Node(""));

treeRouter.use(express.json());

treeRouter.get("/", (req, res, next) => {

    res.json(tree);

});

export { treeRouter };
