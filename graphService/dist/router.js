"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GraphRouter = express_1.Router();
GraphRouter.get('/', (req, res) => {
    res.send('КоляКоляНиколай');
});
exports.default = GraphRouter;
//# sourceMappingURL=router.js.map