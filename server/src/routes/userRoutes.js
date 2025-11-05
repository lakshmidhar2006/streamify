import express from 'express';
import protect from '../middleware/middleware';
import { getRecomendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, rejectFriendRequest , getRequests,outGoingRequests } from '../controllers/userController.js';

const router = express.Router();
router.use(protect);

router.get('/', getRecomendedUsers);
router.get('/friends', getMyFriends );
router.post('/friend-request/:id', sendFriendRequest);
router.put('/accept-friend-request/:id', acceptFriendRequest);
router.put('/reject-friend-request/:id', rejectFriendRequest);
router.get("/reqests",getRequests);
router.get('/outgoing-requests', outGoingRequests); 

export default router;