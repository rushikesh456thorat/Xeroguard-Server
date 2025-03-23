import express from 'express';
import { profilePic, shop, shopCode, shopName } from '../controllers/getdata.controller.js';

const router = express.Router();

// Corrected routes
router.get('/shopname/:accessKey', shopName);
router.get('/profilePic/:accessKey', profilePic);
router.get('/shop/:accessKey', shop);
router.get('/code/:accessKey', shopCode);

export default router;
