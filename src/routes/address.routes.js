import { Router } from 'express';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../controllers/address.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.use(authRequired);
router.get('/', getAddresses);
router.post('/', addAddress);
router.put('/:index', updateAddress);
router.delete('/:index', deleteAddress);

export default router;
