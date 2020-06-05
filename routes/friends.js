const express = require('express');
const mongoose = require("mongoose");

const router = express.Router();

const Friend = require('../models/Friend');
const User = require('../models/User');

controlDeleteFriend = async(friend) => {
    let requester = await User.findOne({ _id: friend.requester._id });
    let recipient = await User.findOne({ _id: friend.recipient._id });

    let reqFilterFriend = await requester.friends.filter(currentFriend => currentFriend.toString() !== friend._id.toString());
    let recFilterFriend = await recipient.friends.filter(currentFriend => currentFriend.toString() !== friend._id.toString());

    requester.friends = reqFilterFriend;
    recipient.friends = recFilterFriend;

    await User.findByIdAndUpdate({_id: requester._id},
        {
            friends: reqFilterFriend
        });

    await User.findByIdAndUpdate({_id: recipient._id},
        {
            friends: recFilterFriend
        });

    await Friend.findByIdAndRemove(friend._id);

    return { status: 1 }
};

/* GET all friends. */
router.get('/', (req, res, next) => {
    const promise = Friend.find()
        .populate({path: 'requester', select: '_id username name surname email'})
        .populate({path: 'recipient', select: '_id username name surname email'})
        .sort({ createdAt: 1 });

    promise.then((friend) => {
        res.json(friend);
    }).catch((error) => {
        res.json(error);
    });

});

/* One user detail friends actions. */
router.get('/:user_id', (req, res, next) => {
    const promise = Friend.find()
        .populate({
            path: 'requester',
            select: '_id username name surname email',
        })
        .populate({
            path: 'recipient',
            select: '_id username name surname email',
        })
        .sort({ createdAt: 1 });

    promise.then((friend) => {
        let requester = [];
        let recipient = [];
        friend.filter(data => {
            if(data.requester._id.toString() === req.params.user_id){
                requester.push(data);
            }else if(data.recipient._id.toString() === req.params.user_id){
                recipient.push(data);
            }
        });

        res.json({requester: requester, recipient: recipient});
    }).catch((error) => {
        res.json(error);
    });

});

/* Add friend request. */
router.post('/', (req, res, next) => {
    const friend = new Friend(req.body);
    const promise = friend.save();

    promise.then((friend) => {
        res.json(friend);
    }).catch((error) => {
        res.json(error);
    });
});

/* Accept friend request. */
router.put('/:friend_id', (req, res, next) => {
    const promise = Friend.findByIdAndUpdate(
        req.params.friend_id,
        {
          status: req.body.status
        },
        {
            new: true
        }
    );

    promise.then(async(friend) => {

        await User.findByIdAndUpdate({_id: friend.requester._id},
            {$push: {friends: friend._id}});

        await User.findByIdAndUpdate({_id: friend.recipient._id},
            {$push: {friends: friend._id}});

        await res.json(friend);
    }).catch((error) => {
        res.json(error);
    });
});

/* DELETE friend. */
router.delete('/:friend_id', (req, res, next) => {
    const promise = Friend.findOne({ _id: req.params.friend_id })
        .populate({
            path: 'requester',
            select: '_id username name surname email',
        })
        .populate({
            path: 'recipient',
            select: '_id username name surname email',
        });

    promise.then( (friend) => {

        controlDeleteFriend(friend).then(data => {
            res.json(data);
        });

    }).catch((error) => {
        res.json(error);
    });

});

module.exports = router;
