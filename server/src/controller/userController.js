import User from '../models/user.js';
import FriendRequest from '../models/friendRequest.js';
export async function getRecomendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = await req.user.model.findById(currentUserId);
        const recommendedUsers = await User.find({
            _id: { $ne: currentUserId, $nin: currentUser.friends ,isonboarded:true }
        });
        res.status(200).json(recommendedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export async function getMyFriends(req, res) {
    try {
        const friends = await user.findById(req.user.id).select('friends').populate('friends', 'fullName  profilePic nativeLanguage learningLanguage');
        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const senderId = req.user.id;
        const recipientId = req.params.id;  
        if (senderId === recipientId) {
            return res.status(400).json({ message: 'You cannot send a friend request to yourself.' });
        }
        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient user not found.' });
        }
        const existingRequest = await FriendRequest.findOne({
            sender: senderId,
            recipient: recipientId,
        });
        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent.' });
        }
        const newFriendRequest = new FriendRequest({
            sender: senderId,
            recipient: recipientId,
        });
        await newFriendRequest.save();
        res.status(200).json({ message: 'Friend request sent successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });


}
}
        
export async function acceptFriendRequest(req, res) {
    try {
        const requestId = req.params.id;
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest || friendRequest.recipient.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Friend request not found.' });
        }
        friendRequest.status = 'accepted';
        await friendRequest.save();
        await User.findByIdAndUpdate(req.user.id, { $push: { friends: friendRequest.sender } });
        await User.findByIdAndUpdate(friendRequest.sender, { $push: { friends: req.user.id } });
        res.status(200).json({ message: 'Friend request accepted.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export async function rejectFriendRequest(req, res) {
    try {
        const requestId = req.params.id;
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest || friendRequest.recipient.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Friend request not found.' });
        }
        await FriendRequest.findByIdAndDelete(requestId);
        res.status(200).json({ message: 'Friend request rejected.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export async function getRequests(req, res) {
    try {
        const requests = await FriendRequest.find({ recipient: req.user.id, status: 'pending' }).populate('sender', 'fullName profilePic nativeLanguage learningLanguage');
        const acceptedRequests = await FriendRequest.find({ sender: req.user.id, status: 'accepted' }).populate('recipient', 'fullName profilePic nativeLanguage learningLanguage');
        res.status(200).json(requests, acceptedRequests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export async function outGoingRequests(req, res) {
    try {
        const requests = await FriendRequest.find({ sender: req.user.id, status: 'pending' }).populate('recipient', 'fullName profilePic nativeLanguage learningLanguage');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }   
}